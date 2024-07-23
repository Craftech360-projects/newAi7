
import os
import random
import sys
from typing import Sequence, Mapping, Any, Union
import torch
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
import uvicorn
import tempfile
import base64
from PIL import Image
import numpy as np

app = FastAPI()

# Define allowed origins
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = "output"

# Ensure the output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_value_at_index(obj: Union[Sequence, Mapping], index: int) -> Any:
    """Returns the value at the given index of a sequence or mapping."""
    try:
        return obj[index]
    except KeyError:
        return obj["result"][index]

def find_path(name: str, path: str = None) -> str:
    """Recursively looks at parent folders starting from the given path until it finds the given name."""
    if path is None:
        path = os.getcwd()

    if name in os.listdir(path):
        path_name = os.path.join(path, name)
        print(f"{name} found: {path_name}")
        return path_name

    parent_directory = os.path.dirname(path)

    if parent_directory == path:
        return None

    return find_path(name, parent_directory)

def add_comfyui_directory_to_sys_path() -> None:
    """Add 'ComfyUI' to the sys.path."""
    comfyui_path = find_path("App")
    if comfyui_path is not None and os.path.isdir(comfyui_path):
        sys.path.append(comfyui_path)
        print(f"'{comfyui_path}' added to sys.path")

# def add_extra_model_paths() -> None:
#     """Parse the optional extra_model_paths.yaml file and add the parsed paths to the sys.path."""
#     # from main import load_extra_path_config

#     extra_model_paths = find_path("extra_model_paths.yaml")

#     if extra_model_paths is not None:
#         load_extra_path_config(extra_model_paths)
#     else:
#         print("Could not find the extra_model_paths config file.")

add_comfyui_directory_to_sys_path()
# add_extra_model_paths()

from nodes import (
    ControlNetApply,
    EmptyLatentImage,
    VAEDecode,
    CLIPTextEncode,
    NODE_CLASS_MAPPINGS,
    VAELoader,
    LoadImage,
    KSampler,
    SaveImage,
    ControlNetLoader,
    CheckpointLoaderSimple,
)

@app.post("/process/")
async def process_image_and_text(file: UploadFile, text: str = Form(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
        tmp_file.write(await file.read())
        tmp_file_path = tmp_file.name

    try:
        with torch.inference_mode():
            emptylatentimage = EmptyLatentImage()
            emptylatentimage_5 = emptylatentimage.generate(width=480, height=272, batch_size=1)

            checkpointloadersimple = CheckpointLoaderSimple()
            checkpointloadersimple_14 = checkpointloadersimple.load_checkpoint(ckpt_name="/models/Deliberate_v3.safetensors")

            cliptextencode = CLIPTextEncode()
            cliptextencode_6 = cliptextencode.encode(text=text, clip=get_value_at_index(checkpointloadersimple_14, 1))

            cliptextencode_7 = cliptextencode.encode(text="blur , noisy", clip=get_value_at_index(checkpointloadersimple_14, 1))

            controlnetloader = ControlNetLoader()
            controlnetloader_12 = controlnetloader.load_controlnet(control_net_name="/models/control_scribble-fp16.safetensors")

            vaeloader = VAELoader()
            vaeloader_13 = vaeloader.load_vae(vae_name="/models/vae-ft-mse-840000-ema-pruned.ckpt")

            loadimage = LoadImage()
            loadimage_26 = loadimage.load_image(image=tmp_file_path)

            controlnetapply = ControlNetApply()
            ksampler = KSampler()
            vaedecode = VAEDecode()
            saveimage = SaveImage()

            controlnetapply_10 = controlnetapply.apply_controlnet(
                strength=0.8,
                conditioning=get_value_at_index(cliptextencode_6, 0),
                control_net=get_value_at_index(controlnetloader_12, 0),
                image=get_value_at_index(loadimage_26, 0),
            )

            ksampler_3 = ksampler.sample(
                seed=random.randint(1, 2**64),
                steps=25,
                cfg=6,
                sampler_name="euler_ancestral",
                scheduler="normal",
                denoise=1,
                model=get_value_at_index(checkpointloadersimple_14, 0),
                positive=get_value_at_index(controlnetapply_10, 0),
                negative=get_value_at_index(cliptextencode_7, 0),
                latent_image=get_value_at_index(emptylatentimage_5, 0),
            )

            vaedecode_8 = vaedecode.decode(samples=get_value_at_index(ksampler_3, 0), vae=get_value_at_index(vaeloader_13, 0))

            # Convert the generated image tensor to a numpy array and squeeze extra dimensions
            image_array = get_value_at_index(vaedecode_8, 0).cpu().numpy().squeeze()
            image_array = (image_array * 255).astype(np.uint8)

            # Convert numpy array to PIL image
            image_pil = Image.fromarray(image_array)

            # Save the PIL image to the output folder
            output_image_path = os.path.join(OUTPUT_DIR, "generated_image.png")
            image_pil.save(output_image_path)

            # Read the saved image file and encode it to base64
            with open(output_image_path, "rb") as img_file:
                img_base64 = base64.b64encode(img_file.read()).decode('utf-8')

    finally:
        os.remove(tmp_file_path)

    return JSONResponse(content={"image": img_base64})

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

import io
import json
import os
import zipfile
import streamlit as st
from dotenv import set_key

st.set_page_config(layout="centered")

_, col_center, _ = st.columns(3)

with col_center:
  st.markdown(
      "<h3 style='text-align: center;'>KnowNow Extension Config</h3>",
      unsafe_allow_html=True,
  )

  api_key_input = st.text_input(
      "Enter API Key", type="password", placeholder="hc_..."
  )

  btn_col1, btn_col2 = st.columns(2)

  with btn_col1:
    if st.button("Save Key", use_container_width=True):
      if api_key_input.strip():
        clean_key = api_key_input.strip()
        root_dir = os.getcwd()

        env_path = os.path.join(root_dir, ".env")
        if not os.path.exists(env_path):
          open(env_path, "w").close()
        set_key(env_path, "HACKCLUB_API_KEY", clean_key)

        json_path = os.path.join(root_dir, "config.json")
        with open(json_path, "w") as f:
          json.dump({"HACKCLUB_API_KEY": clean_key}, f, indent=4)

        st.success("API Key saved successfully!")
      else:
        st.error("Please enter a valid key first.")

  with btn_col2:
    zip_buffer = io.BytesIO()
    root_dir = os.getcwd()

    with zipfile.ZipFile(
        zip_buffer, "w", zipfile.ZIP_DEFLATED
    ) as zip_file:
      for root, dirs, files in os.walk(root_dir):
        if (
            ".git" in root
            or "__pycache__" in root
            or "streamlit_env" in root
        ):
          continue

        for file in files:
          if file.endswith(".zip"):
            continue
          file_path = os.path.join(root, file)
          arcname = os.path.relpath(file_path, root_dir)
          zip_file.write(file_path, arcname)

    zip_bytes = zip_buffer.getvalue()

    st.download_button(
        label="Download",
        data=zip_bytes,
        file_name="know-now.zip",
        mime="application/zip",
        use_container_width=True,
    )
  st.text("Go to chrome://extensions and 'Load Unpacked'")

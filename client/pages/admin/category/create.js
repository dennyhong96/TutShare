import { useState } from "react";
import axios from "../../../utils/axios";
import Dropzone from "react-dropzone";
import clsx from "clsx";
import Resizer from "react-image-file-resizer";

// Nextjs dynamic import
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import ErrorSuccessMsg from "../../../components/ErrorSuccessMsg";
import { API } from "../../../config";
import { restrictToAdmin } from "../../../utils/auth";
import styles from "../../../styles/pages/adminCUCategory.module.scss";

const INITIAL_STATE = {
  name: "",
  description: "<p><br></p>",
  image: null,
  imageName: "",
};

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

const create = () => {
  const [fields, setFields] = useState(INITIAL_STATE);

  const { name, description, image, imageName } = fields;
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (evt) => {
    setErrorMsg("");
    setSuccessMsg("");
    const { name, value } = evt.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuill = (evt) => {
    setErrorMsg("");
    // setSuccessMsg("");
    setFields((prev) => ({ ...prev, description: evt }));
  };

  const handleDropFile = async (acceptedFiles) => {
    setErrorMsg("");
    setSuccessMsg("");
    const file = acceptedFiles[0];
    if (!file) {
      return setErrorMsg("Only supports one image per category.");
    }
    if (!acceptedFiles[0].type.startsWith("image/")) {
      return setErrorMsg("Please upload a valid image file.");
    }
    const processedImageUri = await resizeFile(file);
    setFields((prev) => ({
      ...prev,
      image: processedImageUri,
      imageName: file.name,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!(name && description && image)) {
      return setErrorMsg("Name, description, and image are required.");
    }

    try {
      const res = await axios.post(`${API}/v1/categories`, fields);
      console.log(res.data);

      console.log(`${name} is successfully added as a new category.`);
      setSuccessMsg(`${name} is successfully added as a new category.`);
      setFields(INITIAL_STATE);

      console.log(res.data);
    } catch (error) {
      console.error(error.response);
      setErrorMsg(error.response.data.errors.map((e) => e.msg).join(" "));
    }
  };

  return (
    <div className={styles["create"]}>
      <div className={styles["create__card"]}>
        <h1>Create a category</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles["create__form-control"]}>
            <label htmlFor="name">Add a category name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter a name for the category"
              onChange={handleChange}
              value={name}
            />
          </div>

          {/* Rich text editor */}
          <p className={styles["create__image-prompt"]}>Add a description</p>
          <ReactQuill
            className={styles["quill"]}
            value={description}
            onChange={handleQuill}
          />

          {/* Drop file zone */}
          <p className={styles["create__image-prompt"]}>Add an image</p>
          <Dropzone multiple={false} onDrop={handleDropFile}>
            {({ getRootProps, getInputProps }) => (
              <section className={styles["create__dropzone"]}>
                <div
                  className={styles["create__dropzone__inner"]}
                  {...getRootProps()}
                >
                  <input
                    className={styles["create__dropzone__input"]}
                    {...getInputProps()}
                  />
                  <div
                    className={clsx(styles["create__dropzone__freearea"], {
                      [styles["create__dropzone__freearea-hasfile"]]: image,
                    })}
                  >
                    {imageName ? (
                      <p>{imageName}</p>
                    ) : (
                      <p>
                        Click or drop an image here.{" "}
                        <i className="far fa-image"></i>
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}
          </Dropzone>
          <button className={styles["create__submitBtn"]}>Submit</button>
        </form>
        <ErrorSuccessMsg successMsg={successMsg} errorMsg={errorMsg} />
      </div>
    </div>
  );
};

export default create;

export const getServerSideProps = async (ctx) => {
  return await restrictToAdmin(ctx);
};

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import "../assets/css/post.css";
import { useFormik } from "formik";
import { CreatePostSchema } from "../components/Validations";
import { addPost } from "../reducer/postReducer";

const UpdatePost = ({ post }) => {
    useEffect(() => {
        document.title = "Update Post"
    }, [])
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [postData, setPostData] = useState(null);
    const postId = location.state?.postId || "";
    console.log(postData, "daat")
    useEffect(() => {
        async function fetchPostData() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/editpost/${postId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPostData(data);
                    setLoading(false);
                } else {
                    console.error("Failed to fetch post data");
                }
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        }

        if (postId) {
            fetchPostData();
        }
    }, [postId]);

    const formik = useFormik({
        initialValues: {
            title: postData ? postData.title : "",
            description: postData ? postData.description : "",
            postImg: postData && postData.image ? postData.image : null,
        },
        validationSchema: CreatePostSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            // Prepare FormData for submission
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);

            if (typeof values.postImg === "object") {
                // If `postImg` is a file, append it to FormData
                formData.append("image", values.postImg);
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/updatepost/${postId}`, {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
                    },
                });

                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Post Updated Successfully",
                        confirmButtonText: "OK",
                    }).then(async () => {
                        const responseData = await response.json();
                        dispatch(addPost(responseData.post));
                        navigate("/myprofile");
                    });
                } else {
                    console.error("Failed to update post");
                }
            } catch (error) {
                console.error("Error updating post:", error);
            }
        },
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        formik.setFieldValue("postImg", file);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="postpage-create">
                <div className="heading-part mt-4">
                    <div className="profile-head-head">
                        <h3>Update Post</h3>
                    </div>
                </div>

                <form method="POST" onSubmit={formik.handleSubmit}>
                    <div className="image-part" onClick={() => inputRef.current.click()}>
                        <input
                            type="file"
                            className="edit-btn-profile"
                            name="btnaddmore"
                            style={{ display: "none" }}
                            ref={inputRef}
                            onChange={handleFileChange}
                        />
                        <i class="bi bi-pencil-square" style={{ position: "absolute", left: "72%", top: "16%", cursor: "pointer" }}></i>
                    </div>

                    <div className="image-part-edit-post">
                        {formik.values.postImg && typeof formik.values.postImg === "string" ? (
                            <img
                                src={`${process.env.REACT_APP_API_BASE_URL}/images/${formik.values.postImg}`}
                                alt="Existing Post"
                                style={{ width: "100%", marginLeft: "2px", marginRight: "6px" }}
                            />
                        ) : formik.values.postImg && typeof formik.values.postImg !== "string" ? (
                            <img
                                src={URL.createObjectURL(formik.values.postImg)}
                                style={{ width: "100%" }}
                                alt="Selected Post"
                            />
                        ) : null}
                    </div>


                    <div className="input-control">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="exampleInputTitle"
                            placeholder="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />

                    </div>
                    {formik.touched.title && formik.errors.title && (
                        <p className="err-msg-login">{formik.errors.title}</p>
                    )}

                    <button type="submit" className="btn btn-primary mt-3" style={{ width: "100%" }}>

                        Save
                    </button>
                </form>
            </div>
        </>
    );
};

export default UpdatePost;

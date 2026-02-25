import Swal from "sweetalert2";

/* ✅ Success Alert */
export const successAlert = (title = "Success", text = "") => {
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#111827",
  });
};

/* ❌ Error Alert */
export const errorAlert = (title = "Error", text = "") => {
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#dc2626",
  });
};

/* 🔥 Handle API Errors */
export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    // ✅ Laravel Validation Error
    if (status === 422 && data.errors) {
      const messages = Object.values(data.errors)
        .map((err) => err[0])
        .join("\n");

      errorAlert("Validation Error", messages);
      return;
    }

    // ✅ Backend Custom Message
    if (data.message) {
      errorAlert("Error", data.message);
      return;
    }

    // ✅ 500 Server Error
    if (status === 500) {
      errorAlert("Server Error", "Something went wrong on the server.");
      return;
    }

    errorAlert("Error", "Something went wrong");
  } else {
    errorAlert("Network Error", "Please check your internet connection.");
  }
};

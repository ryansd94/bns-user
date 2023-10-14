export const uploadFile = (file, onProgress) => {
  const url = "https://api.cloudinary.com/v1_1/demo/image/upload";
  const key = "docs_upload_example_us_preset";

  var promise = new Promise(function (res, rej) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.onload = () => {
      const resp = JSON.parse(xhr.responseText);
      res(resp.secure_url);
    };
    xhr.onerror = (evt) => rej(evt);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
        onProgress && onProgress(Math.round(percentage));
      }
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", key);

    xhr.send(formData);
  });
  return promise;
};

export const uploadFile2 = (file, onProgress) => {
  const url = "https://api.cloudinary.com/v1_1/duznt7tzz/image/upload";
  const key = "558321855612198";
  const secret = "HWBwqvKF63KQdym9629vZp24p-I";

  var promise = new Promise(function (res, rej) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.onload = () => {
      const resp = JSON.parse(xhr.responseText);
      res(resp.secure_url);
    };
    xhr.onerror = (evt) => rej(evt);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
        onProgress && onProgress(Math.round(percentage));
      }
    };

    let formData = new FormData();
    const oooo = `eager=w_400,h_300,c_pad|w_260,h_200,c_crop&timestamp=${Date.now()}${secret}`;
    const bufferText = Buffer.from(oooo, "utf8"); // or Buffer.from('hello world')
    console.log(bufferText); // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>

    const text = bufferText.toString("hex");
    // To get hex
    console.log(text); // 68656c6c6f20776f726c64
    formData.append("file", file);
    formData.append("api_key", key);
    formData.append("timestamp", Date.now());
    formData.append("eager", "w_400,h_300,c_pad|w_260,h_200,c_crop");
    formData.append(
      "signature",
      "ae0b1c31de7631ef56d4ce512c0578178564237ed6d5b62d58120ecbde789ea3",
    );
    formData.append("folder", "bns");

    xhr.send(formData);
  });
  return promise;
};

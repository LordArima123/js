const res = fetch("https://jsonplaceholder.typicode.com/photos")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    const images = document.querySelector("#images");
    const temp = [];
    data.forEach((item) => {
      const img = document.createElement("img");

      img.src = item.url;
      img.alt = item.title;

      const imgName = document.createElement("div");
      imgName.textContent = item.title;

      temp.push(img);
      temp.push(imgName);
    });
    images.append(...temp);
  });

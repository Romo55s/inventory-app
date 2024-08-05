import { createWorker } from "tesseract.js";

const convertor = async (image: string) => {
  const worker = await createWorker("eng");
  await worker.setParameters({
    tessjs_create_box: "2",
  })
  const ret = await worker.recognize(image);
  const text = ret.data.text;
  await worker.terminate();
  return text;
};

export default convertor;

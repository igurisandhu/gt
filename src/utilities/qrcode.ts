import QRCode from "qrcode";

const generateQRCode = async (text: string) => {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      width: 400,
    });
  } catch (err) {
    throw err;
  }
};

export { generateQRCode };

import QRCode from "qrcode";

const generateQRCode = async (text: string) => {
  return await QRCode.toDataURL(text, {
    errorCorrectionLevel: "H",
    width: 400,
  });
};

export { generateQRCode };

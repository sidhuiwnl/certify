import QRCode from 'qrcode';

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Fallback to Google Charts API
    return `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(text)}`;
  }
};

export const generateQRCodeForCertificate = async (certificateId: string): Promise<string> => {
  const verificationUrl = `${window.location.origin}/verify/${certificateId}`;
  return await generateQRCode(verificationUrl);
};
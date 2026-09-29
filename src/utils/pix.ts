import QRCode from 'qrcode';

/**
 * Generates an official Brazilian standard PIX EMV Copia-e-Cola payload
 * with CRC16 CCITT validation.
 */
function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function crc16(str: string): string {
  let crc = 0xffff;
  const strlen = str.length;
  for (let c = 0; c < strlen; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}

export function generatePixPayload(key: string, amount: string, name: string = 'Marillia dailsa da silva', city: string = 'SAO PAULO'): string {
  // Normalize key (clean any non-alphanumeric except +)
  const cleanKey = key.trim();
  const cleanAmount = parseFloat(amount.replace(',', '.')).toFixed(2);
  const cleanName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 25);
  const cleanCity = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 15);

  const merchantAccountInfo =
    formatField('00', 'BR.GOV.BCB.PIX') +
    formatField('01', cleanKey);

  let raw =
    formatField('00', '01') + // Payload Format Indicator
    formatField('26', merchantAccountInfo) +
    formatField('52', '0000') + // Merchant Category Code
    formatField('53', '986') + // Currency: BRL
    formatField('54', cleanAmount) + // Amount
    formatField('58', 'BR') + // Country code
    formatField('59', cleanName) + // Merchant name
    formatField('60', cleanCity) + // Merchant city
    formatField('62', formatField('05', 'CONSULTA990')) + // Additional Data Field
    '6304'; // CRC16 placeholder

  const checksum = crc16(raw);
  return `${raw}${checksum}`;
}

export async function generateQrCodeDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#170407',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Error generating PIX QR Code:', err);
    return '';
  }
}

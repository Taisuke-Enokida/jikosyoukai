import { toPng } from 'html-to-image';

export const exportCardAsPng = async (element: HTMLElement): Promise<void> => {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
  });

  const link = document.createElement('a');
  link.download = `self-intro-card-${new Date().toISOString().slice(0, 10)}.png`;
  link.href = dataUrl;
  link.click();
};

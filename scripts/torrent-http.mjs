export function byteRange(header, size) {
  if (!header) return { start: 0, end: size - 1, partial: false };
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match || (!match[1] && !match[2])) return null;
  const suffix = !match[1];
  const start = suffix
    ? Math.max(0, size - Number(match[2]))
    : Number(match[1]);
  const end =
    suffix || !match[2] ? size - 1 : Math.min(Number(match[2]), size - 1);
  if (
    (suffix && Number(match[2]) <= 0) ||
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start >= size ||
    start > end
  )
    return null;
  return { start, end, partial: true };
}
export function pickVideo(files, index) {
  if (index !== undefined) {
    const file = files[index];
    if (!file || !/\.(mp4|webm|m4v|mkv|mov|avi|ts|ogv)$/i.test(file.name))
      throw new Error("The selected file is not a video.");
    return file;
  }
  const videos = files.filter((file) =>
    /\.(mp4|webm|m4v|mkv|mov|avi|ts|ogv)$/i.test(file.name),
  );
  if (!videos.length) throw new Error("This torrent contains no video file.");
  // Samples often come first. Select the largest video, not the first file.
  return videos.sort((a, b) => b.length - a.length)[0];
}

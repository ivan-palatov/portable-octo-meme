export function saveToCsv(
  content: string,
  fileName: string,
  mimeType = 'text/csv;encoding:utf-8'
) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: mimeType }));
  a.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function matrixToString(matrix: number[][]) {
  let csvContent = '';
  matrix.forEach((infoArray, index) => {
    const dataString = infoArray.join(';');
    csvContent += index < matrix.length ? dataString + '\n' : dataString;
  });

  return csvContent;
}

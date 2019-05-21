function deltaOfDir(d) {
  switch (d) {
    case 0:
      dx = 1;
      dy = 0;
      break;
    case 1:
      dx = -1;
      dy = 0;
      break;
    case 2:
      dx = 0;
      dy = 1;
      break;
    case 3:
      dx = 0;
      dy = -1;
  }
}

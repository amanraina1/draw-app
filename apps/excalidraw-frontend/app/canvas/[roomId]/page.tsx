"use client";

export default function Canvas() {
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [canDraw, setCanDraw] = useState(false);
  // const [coord, setCoord] = useState({ startx: 0, starty: 0 });

  // const handleMouseDown = (e) => {
  //   setCanDraw(true);
  //   setCoord((prev) => {
  //     return { ...prev, startx: e.clientX, starty: e.clientY };
  //   });
  // };
  // const handleMouseUp = (e) => {
  //   setCanDraw(false);
  // };

  // const handleMouseMove = (e) => {
  //   console.log(canDraw);
  //   if (!canDraw || !canvasRef.current) return;

  //   const width = e.clientX - coord.startx;
  //   const height = e.clientY - coord.starty;

  //   const ctx = canvasRef.current.getContext("2d");
  //   ctx.clearRect(0, 0, 500, 500);
  //   ctx.strokeRect(coord.startx, coord.starty, width, height);
  // };

  // useEffect(() => {
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const ctx = canvas.getContext("2d");
  //     if (!ctx) return;
  //   }
  // }, [canvasRef]);
  return <div>hello</div>;
}

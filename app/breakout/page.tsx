'use client'
import './breakout.css'
import {useEffect, useRef} from "react";
import {Simulate} from "react-dom/test-utils";
import reset = Simulate.reset;

function useInterval(callback: Function, delay: number) {
    const savedCallback = useRef<Function>();
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(() => {
        function tick() {
            savedCallback.current!();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay])
}

export default function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    //lazy init
    let x = 0;
    let y = 0;
    let paddleX = 0;

    let dx = 2;
    let dy = -2;
    const ballRadius = 10;
    const paddleHeight = 10;
    const paddleWidth = 75;

    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    let score = 0;

    function resetValues() {
        const canvas = canvasRef.current!;
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        score = 0;

        rightPressed = false;
        leftPressed = false;

        paddleX = (canvas.width - paddleWidth) / 2;
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = {x: 0, y: 0, status:true}
            }
        }
    }

    interface brick {
        x: number,
        y: number,
        status: boolean,
    }

    let bricks: Array<Array<brick>> = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {x: 0, y: 0, status:true}
        }
    }

    function keyDownHandler(e: KeyboardEvent) {
        if (e.code == 'ArrowRight') {
            rightPressed = true;
        }
        if (e.code == 'ArrowLeft') {
            leftPressed = true;
        }
    }

    function keyUpHandler(e: KeyboardEvent) {
        if (e.code == "ArrowRight") {
            rightPressed = false;
        }
        if (e.code == "ArrowLeft") {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e:MouseEvent) {
        const canvas = canvasRef.current!!;
        var relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth/2;
        }
    }

    function collisionDetection() {
        for(let c = 0; c < brickColumnCount; c++) {
            for(let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if(b.status) {
                    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = false;
                        score++;
                        if(score == brickRowCount * brickColumnCount) {
                            alert("YOU WIN, CONGRATULATIONS");
                            resetValues();
                        }
                    }
                }
            }
        }
    }

    function draw() {
        const ctx = canvasRef.current!.getContext("2d")!;
        const canvas = canvasRef.current!;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScore();
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
    }

    function drawScore() {
        const ctx = canvasRef.current!.getContext("2d")!;
        ctx.font = "16px Arial";
        ctx.fillStyle = '#0095DD';
        ctx.fillText("Score: "+score, 8, 20);
    }


    function drawBricks() {
        const ctx = canvasRef.current!.getContext("2d")!;
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if(bricks[c][r].status) {
                    const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawBall() {
        const ctx = canvasRef.current!.getContext("2d")!;
        const canvas = canvasRef.current!;

        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                alert("GAME OVER");
                resetValues();
            }
        }

        x += dx;
        y += dy;
    }

    function drawPaddle() {
        const ctx = canvasRef.current!.getContext("2d")!;
        const canvas = canvasRef.current!;

        if (rightPressed) {
            paddleX += 7
        } else if (leftPressed) {
            paddleX -= 7
        }

        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
    }

    useInterval(() => {
        draw()
    }, 10);

    useEffect(() => {
        const ctx = canvasRef.current!.getContext("2d")!;
        const canvas = canvasRef.current!;
        document.addEventListener("keyup", keyUpHandler, false);
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("mousemove", mouseMoveHandler, false);
        x = canvas.width / 2;
        y = canvas.height - 30;


        paddleX = (canvas.width - paddleWidth) / 2;
    });

    return (
        <>
            <canvas ref={canvasRef} width={"480"} height={"320"}></canvas>
        </>
    )
}

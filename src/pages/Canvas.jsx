import { useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Image,
  Text,
  Rect,
  Circle,
  RegularPolygon,
  Transformer,
} from "react-konva";
import { useLocation } from "react-router-dom";
import { Button, Col, Form, Row } from "react-bootstrap";
import useImage from "use-image";
import "./CanvasPage.css";

const CanvasPage = () => {
  const location = useLocation();
  const { image } = location.state || {};
  const [konvaImage] = useImage(image?.webformatURL || "", "anonymous");
  const [elements, setElements] = useState([]);
  const [captionText, setCaptionText] = useState("");
  const [textColor, setTextColor] = useState("black");
  const [shapeColor, setShapeColor] = useState("red");
  const [shapeType, setShapeType] = useState("rect");
  const [selectedId, setSelectedId] = useState(null);
  const [something, setSomething] = useState(false);
  const stageRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    if (konvaImage) {
      const { width, height } = konvaImage;
      stageRef.current.width(width);
      stageRef.current.height(height);
    }
  }, [konvaImage]);

  useEffect(() => {
    if (!image) {
      console.error("No image data found.");
    }
  }, [image, something]);

  const addCaption = () => {
    if (captionText.trim()) {
      setElements([
        ...elements,
        {
          id: `text-${elements.length}`,
          type: "text",
          text: captionText,
          x: 50,
          y: 50,
          draggable: true,
          color: textColor,
          fontSize: 18,
        },
      ]);
      setCaptionText("");
    }
  };

  const addShape = () => {
    const id = `shape-${elements.length}`;
    const newShape =
      shapeType === "rect"
        ? {
            id,
            type: "rect",
            x: 100,
            y: 100,
            width: 100,
            height: 50,
            fill: shapeColor,
            draggable: true,
          }
        : shapeType === "circle"
        ? {
            id,
            type: "circle",
            x: 150,
            y: 150,
            radius: 50,
            fill: shapeColor,
            draggable: true,
          }
        : {
            id,
            type: "polygon",
            x: 200,
            y: 200,
            sides: 5,
            radius: 50,
            fill: shapeColor,
            draggable: true,
          };
    setElements([...elements, newShape]);
  };

  const downloadImage = (format = "png") => {
    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const uri = stageRef.current.toDataURL({ mimeType, quality: 1.0 });
    const link = document.createElement("a");
    link.download = `canvas-image.${format}`;
    link.href = uri;
    link.click();
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    const selectedNode = stageRef.current.findOne(`#${id}`);
    if (transformerRef.current && selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    }
  };

  const logCanvasElements = () => {
    const canvasData = elements.map((element) => {
      return {
        id: element.id,
        type: element.type,
        attributes: { ...element }, // Include all attributes for transparency
      };
    });
    console.log("Canvas Elements:", canvasData);
  };

  const handleTransform = (id, newAttrs) => {
    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, ...newAttrs } : el
    );
    setElements(updatedElements);
  };

  return (
    <div className="canvas-page">
      <Row>
        <Col>
          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Enter caption..."
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2">
                <Form.Select
                  size="sm"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                >
                  <option value="black">Black</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Button
                onClick={addCaption}
                variant="primary"
                size="sm"
                className="mb-2"
              >
                Add Caption
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Select
                  size="sm"
                  value={shapeType}
                  onChange={(e) => setShapeType(e.target.value)}
                >
                  <option value="rect">Rectangle</option>
                  <option value="circle">Circle</option>
                  <option value="polygon">Polygon</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2">
                <Form.Select
                  size="sm"
                  value={shapeColor}
                  onChange={(e) => setShapeColor(e.target.value)}
                >
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Button
                onClick={addShape}
                variant="secondary"
                size="sm"
                className="mb-2"
              >
                Add Shape
              </Button>
            </Col>
            <Col> </Col>
          </Row>

          <div className="instructions mt-4 p-2 bg-light border">
            <h5>Instructions:</h5>
            <ul className="mb-0">
              <li>
                For Streched and Distorted Image press adjust Image{" "}
                <Button
                  onClick={() => setSomething(true)}
                  variant="success"
                  size="sm"
                  className=""
                >
                  Adjust Image
                </Button>
              </li>
              <li>Double-click on an element to resize it.</li>
              <li>Drag and drop elements to reposition them.</li>
              <li>Click on an element to select and transform it.</li>
              <li>Use the controls above to add captions and shapes.</li>
              <li>Download your canvas as PNG or JPEG.</li>
            </ul>
          </div>
          <Row>
            {" "}
            <div>
              <Button
                onClick={() => downloadImage("png")}
                variant="success"
                size="sm"
                className="m-2"
              >
                Download as PNG
              </Button>
              <Button
                onClick={() => downloadImage("jpeg")}
                variant="success"
                size="sm"
                className="m-2"
              >
                Download as JPEG
              </Button>

              <Button
                onClick={logCanvasElements}
                variant="info"
                size="sm"
                className="m-2"
              >
                Log Canvas Elements
              </Button>
            </div>
          </Row>
        </Col>
        <Col>
          <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            ref={stageRef}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) {
                setSelectedId(null);
                transformerRef.current?.detach();
                transformerRef.current?.getLayer().batchDraw();
              }
            }}
          >
            <Layer>
              <Rect
                width={window.innerWidth}
                height={window.innerHeight}
                fill="white"
              />

              {konvaImage && (
                <Image
                  image={konvaImage}
                  x={0}
                  y={0}
                  width={stageRef.current?.width() || window.innerWidth} // Scale down width
                  height={stageRef.current?.height() || window.innerHeight} // Scale down height
                />
              )}
              {elements.map((element) => (
                <>
                  {element.type === "text" && (
                    <Text
                      id={element.id}
                      text={element.text}
                      x={element.x}
                      y={element.y}
                      fill={element.color}
                      fontSize={element.fontSize}
                      draggable={element.draggable}
                      onClick={() => handleSelect(element.id)}
                    />
                  )}
                  {element.type === "rect" && (
                    <Rect
                      id={element.id}
                      x={element.x}
                      y={element.y}
                      width={element.width}
                      height={element.height}
                      fill={element.fill}
                      draggable={element.draggable}
                      onClick={() => handleSelect(element.id)}
                    />
                  )}
                  {element.type === "circle" && (
                    <Circle
                      id={element.id}
                      x={element.x}
                      y={element.y}
                      radius={element.radius}
                      draggable={element.draggable}
                      fill={element.fill}
                      onClick={() => handleSelect(element.id)}
                    />
                  )}
                  {element.type === "polygon" && (
                    <RegularPolygon
                      id={element.id}
                      x={element.x}
                      y={element.y}
                      sides={element.sides}
                      radius={element.radius}
                      fill={element.fill}
                      draggable={element.draggable}
                      onClick={() => handleSelect(element.id)}
                    />
                  )}
                </>
              ))}
              <Transformer ref={transformerRef} />
            </Layer>
          </Stage>
        </Col>
      </Row>
    </div>
  );
};

export default CanvasPage;

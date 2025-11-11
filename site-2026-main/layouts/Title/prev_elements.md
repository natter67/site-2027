// REPLACE with new graphics soon
const elements = [
{
src: "/assets/gifs/satellite.gif",
size: `${windowWidth / 1.8}px`,
top: "95%",
left: "85%",
animation: "float infinite",
zIndex: "0"
},
{
src: "/assets/gifs/beaker.gif",
size: `${windowWidth / 2}px`,
top: "40%",
left: "80%",
animation: "float infinite",
zIndex: "0",
},
{
src: "/assets/gifs/breadboard animation.gif",
size: `${windowWidth / 3}px`,
top: "-25%",
left: "10%",
animation: "float 3s ease-in-out infinite",
},
{
src: "/assets/gifs/compass.gif",
size: `${windowWidth / 2}px`,
top: "25%",
left: "90%",
animation: "float infinite",
zIndex: "0",
},
{
src: "/assets/gifs/compass needle.png",
size: `${windowWidth / 3}px`,
top: "25%",
left: "100%",
animation: "spin 3s linear infinite",
},
{
src: "/assets/logo/magnifier.png",
size: `${windowWidth / 8}px`,
top: "81%",
left: "30%",
zIndex: 3,
animation: "float 5s ease-in-out infinite",
},
{
src: "/assets/logo/moon.png",
size: `${windowWidth / 20}px`,
top: "50%",
left: "15%",
animation: "float 5s ease-in-out infinite",
},
{
src: "/assets/logo/newrocket.png",
size: `${windowWidth / 5}px`,
top: "50%",
left: "0%",
zIndex: 1,
transform: "translate(-10%, -20%)",
animation: "fly-across 4s linear forwards",
zIndex: "0",
},
{
src: "/assets/logo/windmill.png",
size: `${windowWidth / 7}px`,
top: "70%",
left: "6%",
zIndex: 3,
},
{
src: "/assets/logo/world.png",
size: `${windowWidth / 4.5}px`,
top: "75%",
left: "-10%",
animation: "float 8s ease-in-out infinite",
zIndex: 1,
},
];

const filteredElements =
windowWidth < 768
? elements.filter(
(element) =>
element.src === "/assets/logo/newrocket.png" ||
element.src === "/assets/gifs/compass.gif" ||
element.src === "/assets/gifs/satellite.gif" ||
element.src === "/assets/logo/world.png"
)
: elements;

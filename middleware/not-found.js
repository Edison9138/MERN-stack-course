// middleware refers to a software component or function that 
// sits between the server and the application's request/response handling logic
const notFoundMiddleware = (req, res) => {
    res.status(404).send("Route does not exist")
}

export default notFoundMiddleware
const allowedOrigins = [
    'https://taj-mern-stack.netlify.app',
    'http://localhost:3001',
    'http://localhost:5173',
];

const corsOptions = {
    origin: (origin, callback) => {
        console.log(`Origin: ${origin}`);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            console.log('CORS allowed');
            callback(null, true);
        } else {
            console.log('CORS blocked');
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
module.exports = corsOptions;

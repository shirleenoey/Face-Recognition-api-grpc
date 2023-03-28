const PAT = '824b4d6ded4144b194d6531b6fb5560b'
const USER_ID = 'test_6392';
const APP_ID = 'test';

const MODEL_ID = 'a403429f2ddf4b49b307e318f00e528b';
const MODEL_VERSION_ID = '34ce21a40cc24b6b96ffee54aabff139';

const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();


const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const handleApiCall = (req, res) => {
	stub.PostModelOutputs(
		{
			user_app_id: {
					"user_id": USER_ID,
					"app_id": APP_ID
			},
			model_id: MODEL_ID, 
			version_id: MODEL_VERSION_ID,
			inputs: [
					{ data: { image: { url: req.body.input, allow_duplicate_url: true } } }
			]
		},
		metadata,
		(err, response) => {
				if (err) {
					throw new Error(err);
				}

				if (response.status.code !== 10000) {
					throw new Error("Post model outputs failed, status: " + response.status.description);
				}

				const output = response.outputs[0];

				console.log("Predicted concepts:");
        for (const concept of output.data.concepts) {
            console.log(concept.name + " " + concept.value);
				}
				res.json(response);
		}
	);
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
  	.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0].entries)
		})
		.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleApiCall,
	handleImage
}
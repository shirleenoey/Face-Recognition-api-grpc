const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 3722702fff174d77a64e4e087fdaaba2");

// const Clarifai = require('clarifai');
// console.log(Clarifai);

// const app = new Clarifai.App({apiKey: '3722702fff174d77a64e4e087fdaaba2'});

const handleApiCall = (req, res) => {
	stub.PostModelOutputs(
		// {
				// This is the model ID of a publicly available General model. You may use any other public or custom model ID.
				// model_id: 'a403429f2ddf4b49b307e318f00e528b',
				// inputs: [{data: {image: {url: req.body.input}}}]
		// },
		{
			user_app_id: {
					"user_id": 'shirleenoey',
					"app_id": 'test'
			},
			model_id: 'a403429f2ddf4b49b307e318f00e528b', 
			version_id: '34ce21a40cc24b6b96ffee54aabff139',
			inputs: [
					{ data: { image: { url: req.body.input, allow_duplicate_url: true } } }
			]
		},
		metadata,
		(err, response) => {
				if (err) {
						console.log("Error: " + err);
						return;
				}

				if (response.status.code !== 10000) {
						console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
						return;
				}

				console.log("Predicted concepts, with confidence values:")
				for (const c of response.outputs[0].data.concepts) {
						console.log(c.name + ": " + c.value);
				}
				res.json(response);
		}
	);
}

// const handleApiCall = (req, res) => {
	// app.models
	// 	.predict(
	// 		{
	// 		id: "a403429f2ddf4b49b307e318f00e528b",
	// 		version: "34ce21a40cc24b6b96ffee54aabff139",
	// 		},
	// 		req.body.input)
	// 	.then(data => {
	// 		res.json(data);
	// 	})
	// 	.catch(err => res.status(400).json('unable to work with API'))
// }

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
	handleImage,
	handleApiCall
}
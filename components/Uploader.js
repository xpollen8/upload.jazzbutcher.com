import { useEffect, useState } from 'react';
import axios from 'axios';

//const AWS_BUCKET = process.env.JBC_AWS_BUCKET;
//const AWS_BUCKET_OBJECT = process.env.JBC_AWS_BUCKET_OBJECT;

//console.log("AWS", { AWS_BUCKET, AWS_BUCKET_OBJECT });
//const baseFilename = (id, file, ext) => `${id}:${file}`;

//const bucketFilename = (id, file, ext) => `${AWS_BUCKET_OBJECT}/${baseFilename(id, file, ext)}`;

//const displayFilename = (id, file, ext) => `https://${AWS_BUCKET}/${bucketFilename(id, file, ext)}`;

const AssetUploader = ({ id = 'MISSING', value = '', setValue }) => {

	const [ fName, fileType ] = value?.match('mbmoms') ? [ value, null ] : value.split('.');
	//const [ filename, setFilename ] = useState(value ? displayFilename(id, value, fileType) : null);
	const [ filename, setFilename ] = useState(value);
	const [ uploadInput, setUploadInput ] = useState();
	const [ newFile, setNewfile ] = useState(false);

  const handleChange = (ev) => {
		if (ev.target.files.length) {
			setNewfile(true);
			setFilename(URL.createObjectURL(ev.target.files[0]));
		}
  }
  // Perform the upload
  const handleUpload = async (ev) => {
		ev.preventDefault();
    const file = uploadInput.files[0];
    // Split the filename to get the name and type
    const [ fName, fileType ] = file?.name.split('.');
		const fileName = file.name;
		//const baseName = baseFilename(id, file.name, fileType);

		console.log("UPLOAD", { fileName, fileType });
		if (!fileName) {
			throw 'invalid type';
		}
    fetch(`/api/sign_s3`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
				fileName,
				fileType,
			})
    })
		.then(e => e.json())
		.then(response => {
			const { url, signedRequest } = response.data.returnData;
			//console.log("url", url);
			//console.log("Received a signed request " + signedRequest);
			
		 // Put the fileType in the headers for the upload
			const options = {
				headers: {
					'Content-Type': fileType
				}
			};
			//console.log("SENDING", { signedRequest, options });
			axios.put(signedRequest,file,options)
			.then(result => {
				console.log("Response from s3", result, { fileName })
				//setFilename(`${displayFilename(id, file.name, fileType)}?${Date.now()}`);
				//setValue(baseName);
				setNewfile(false);
			})
			.catch(error => {
				console.log("ERROR1", JSON.stringify(error));
				//alert("ERROR " + JSON.stringify(error));
			})
		})
		.catch(e => {
				console.log("ERROR2", e);
        //alert("ERROR " + JSON.stringify(e));
		});
  }
  
	return (
		<div className="App">
			<center>
				{filename &&
					<div style={{padding:10}}>
						<a onClick={(e) => { e.preventDefault();  uploadInput.click() }}>
							<img src={filename} style={{width: '100%'}}/>
						</a>
					</div>
				}
				{!filename &&
						<a onClick={(e) => { e.preventDefault();  uploadInput.click() }}>
							Click to add new image
						</a>
				}
				<input onChange={handleChange}
					ref={(ref) => { setUploadInput(ref); }}
					type="file" accept="image/jpeg, image/png, video/mp4" hidden />
				{(newFile) &&
					<button onClick={handleUpload}>UPLOAD</button>
				}
			</center>
		</div>
	);
}

export default AssetUploader;

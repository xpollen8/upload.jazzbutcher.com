import { useEffect, useState } from 'react';
import axios from 'axios';

const AssetUploader = ({ session = { email: 'MISSING' }, id = 'MISSING', value = '', setValue }) => {
	//const [ fName, fileType ] = value.split('.');
	const [ filename, setFilename ] = useState(value);
	const [ fName, setFName ] = useState();
	const [ fileType, setFileType ] = useState();
	const [ uploading, setUploading ] = useState();
	const [ uploadInput, setUploadInput ] = useState();
	const [ newFile, setNewfile ] = useState(false);
	const [ progress, setProgress ] = useState();

	console.log("SESSION", session);

  const handleChange = (ev) => {
		if (ev.target.files.length) {
			setNewfile(true);
			setFilename(URL.createObjectURL(ev.target.files[0]));
			console.log("FILENAME", filename, ev.target.files[0]);
			const [ x1, x2 ] = ev.target.files[0]?.name?.split('.');
			setFName(x1);
			setFileType(x2);
		}
  }
  // Perform the upload
  const handleUpload = async (ev) => {
		ev.preventDefault();
		setUploading(true);
		setProgress('Signing..');
    const file = uploadInput.files[0];
    // Split the filename to get the name and type
    //const [ fName, fileType ] = file?.name.split('.');
		const fileName = `${id}::${session?.email}::${file.name}`;

		console.log("UPLOAD", { fileName, fileType });
		if (!fileName) {
			throw 'invalid type';
		}
		setUploading(true);
		setProgress('Uploading..');
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
					'Content-Type': fileType,
				},
				onUploadProgress: (progressEvent) => {
					const percent = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
					setProgress(percent === 100 ? 'Finishing..' : `${percent}%`);
				}
			};
			//console.log("SENDING", { signedRequest, options });
			axios.put(signedRequest,file,options)
			.then(result => {
				console.log("Response from s3", result, { fileName })
				//setFilename(`${displayFilename(id, file.name, fileType)}?${Date.now()}`);
				//setValue(baseName);
				setNewfile(false);
				setUploading();
				setProgress('Success!');
			})
		})
		.catch(e => {
				setUploading();
				console.log("ERROR", e);
        //alert("ERROR " + JSON.stringify(e));
		});
  }
  
	console.log(">>>>", { filename, fileType, fName });
	return (
		<>
		<div className="App">
			<center>
				{filename &&
					<div style={{padding:10}}>
						<a onClick={(e) => {
							e.preventDefault();
							uploadInput.click()
						}}>
							{['jpeg','png','jpg','gif'].includes(fileType) &&
							<img src={filename} style={{width: '100%'}}/>}
							{fName && <div>{fName}</div>}
						</a>
					</div>
				}
				{!uploading &&
					<button onClick={(e) => { e.preventDefault();  uploadInput.click() }}>Select a file to upload</button>
				}
				<input onChange={handleChange}
					ref={(ref) => { setUploadInput(ref); }}
					type="file" accept="image/jpeg, image/png, video/mp4" hidden />
				{(newFile && !uploading) &&
					<button onClick={handleUpload}>Upload it!</button>
				}
			</center>
		</div>
		<div className="App">
			<center>
			{(progress) ?
				(<div className="progress">{progress}</div>) : 
				(<div>Instructions: <b>Select</b>.. <b>Upload</b>.. <i>Wait!</i></div>)}
			</center>
		</div>
		</>
	);
}

export default AssetUploader;

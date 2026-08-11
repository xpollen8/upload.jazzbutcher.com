import { useEffect, useState } from 'react';
import axios from 'axios';

const put = (url, data) => {
  return new Promise((resolve, reject) => {
		 axios.put(url,data)
			 .then(result => resolve())
			 .catch(e => reject(e))
	});
};

const AssetUploader = ({ who = 'MISSING', value = '', setValue }) => {
	const [ filename, setFilename ] = useState(value);
	const [ fName, setFName ] = useState();
	const [ fileType, setFileType ] = useState();
	const [ uploading, setUploading ] = useState();
	const [ uploadInput, setUploadInput ] = useState();
	const [ newFile, setNewfile ] = useState(false);
	const [ progress, setProgress ] = useState();

  const handleChange = (ev) => {
		if (ev.target.files.length) {
			setNewfile(true);
			setFilename(URL.createObjectURL(ev.target.files[0]));
			const [ x1, x2 ] = ev.target.files[0]?.name?.split('.');
			setFName(x1);
			setFileType(x2);
		}
  }
  // Perform the upload
  const handleUpload = async (ev) => {
		ev.preventDefault();
		setUploading(true);
    const file = uploadInput.files[0];
		const fileName = `${who}::${file.name}`;

		if (!fileName) {
			throw 'invalid type';
		}
		setUploading(true);
		setProgress('Signing..');
    await fetch(`/api/sign_s3`, {
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
		.then(async ({ success, url, signedRequest }) => {
			setProgress('Uploading..');
			put(signedRequest, file)
				.then(res => {
					setNewfile(false);
					setUploading();
					setProgress('Success!');
				})
				.catch(e => {
					setUploading();
					setProgress(`PUT Failed! ${JSON.stringify(e)}`);
				});
		})
		.catch(e => {
			setUploading();
			setProgress(`Fetch Failed! ${JSON.stringify(e)}`);
		});
  }
  
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
							{['bmp','jpeg','png','jpg','gif'].includes(fileType) &&
							<img src={filename} style={{width: '100%'}}/>}
							{fName && <div>{fName}.{fileType}</div>}
						</a>
					</div>
				}
				{!uploading &&
					<button onClick={(e) => { e.preventDefault();  uploadInput.click() }}>Select a file to upload</button>
				}
				<input onChange={handleChange}
					ref={(ref) => { setUploadInput(ref); }}
					type="file" hidden />
				{(newFile && !uploading) &&
					<button onClick={handleUpload}>Upload it!</button>
				}
			</center>
		</div>
		{(progress) && <div className="App">
			<center><div className="progress">{progress}</div></center>
		</div>}
		</>
	);
}

export default AssetUploader;

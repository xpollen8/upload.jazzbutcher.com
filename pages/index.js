import React, { useRef, useEffect, useState } from "react";
import { signIn, signOut, getSession } from 'next-auth/client'
import Layout from '../components/Layout';
import Uploader from '../components/Uploader';
import Transfer from '../components/Transfer';

export async function getServerSideProps({ req, res }) {
	const session = (await getSession({ req })) || process.env.NEXTAUTH_URL === 'http://localhost:3000';
	const issues = await fetch('https://api.github.com/search/issues?q=repo:xpollen8/jazzbutcher.com+type:issue+state:open&sort=asc')
		.then(r => r.json())
		.then(r => r?.items?.map(({ title, number }) => {
			const truncAt = 40;
			return {
				number,
				title: (title?.length > truncAt) ? `${title.substr(0, truncAt)}...` : title }
		}));
  return {
    props: {
			session,
			issues,
		},
  }
}

function FileUploaderDND(props) {
  const state = {
    inDropZone: false,
    fileList: []
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'AddToDropZone':
        return { ...state, inDropZone: action.inDropZone };
      case 'AddToList':
        return { ...state, fileList: state.fileList.concat(action.files) };
      default:
        return state;
    }
  };

  const [data, dispatch] = React.useReducer(reducer, state);

  const handleDragEnter = (event) => {
    event.preventDefault();
    dispatch({ type: 'AddToDropZone', inDropZone: true });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    dispatch({ type: 'AddToDropZone', inDropZone: true });
  };

  const handleDrop = (event) => {
    event.preventDefault();

    let files = [...event.dataTransfer.files];
    let files_with_preview = [];

    files.map((file, index) => {
      file[`image_${index}`] = URL.createObjectURL(file);
      files_with_preview.push(file);
    });

    if (files) {
      dispatch({ type: 'AddToList', files });
      dispatch({ type: 'AddToDropZone', inDropZone: false });
    }
  };

  useEffect(() => {
    if (data.fileList[0]) {
      const latestImage = data.fileList[data.fileList.length - 1];
      let blob = latestImage.preview;
      let name = latestImage.name;
      let img = new Image();
      img.src = blob;

      let reader = new FileReader();
      reader.readAsDataURL(latestImage);
      reader.onloadend = function () {
        let base64data = reader.result;
        props.changeInputFile({
          name: name,
          file: base64data,
          width: img.width,
          height: img.height
        });
      };
    }
  }, [data]);

  return (
    <div
      id="fileuploaderdnd-container"
      className="fileuploaderdnd-container"
      onDrop={(event) => handleDrop(event)}
      onDragOver={(event) => handleDragOver(event)}
      onDragEnter={(event) => handleDragEnter(event)}
    >
      <div className="fileuploaderdnd-container-button">
        <div className="fileuploaderdnd-container-text">
          drag and drop an image here to see output 👉🏼
        </div>
      </div>
    </div>
  );
}

const App = ({ session, issues }) => {
	const [ id, setId ] = useState();
	const [ value, setValue ] = useState();
	const [ url, setURL ] = useState();

		const [image, setImage] = useState('');
	  const setImageAction = (img) => {
		    console.log(img);
				    setImage(img);
						  };
	return (
		<Layout title="Uploader">
			<noscript>
				<style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
			</noscript>
			{(session) ? (<>
				<div className="App">
				<center>
				<b>Github Issue</b>:
				<select name="id" value={id} onChange={(ev) => setId(ev?.target?.value)} >
				<option value={0} >-- Choose --</option>
				{issues.map(({ number, title }) => (<option key={number} value={number}>#{number}: {title}</option>))}
				</select>
				</center>
				{(id && parseInt(id, 10) > 0) && <Uploader who={session?.user?.email} id={id} />}
				{(id && parseInt(id, 10) > 0) && <Transfer who={session?.user?.email} id={id} />}

				{/*
				<h1>File Uploader Drag and Drop</h1>
				<div className="container">
        <FileUploaderDND changeInputFile={setImageAction} />
        {image ? (
          <img
            className="placeholder"
            src={image.file}
            width={250}
            height={250}
          />
        ) : (
          <div className="placeholder" />
        )}
      </div>*/}


				<div>
					<hr/>
					Instructions:
					<ol>
					<li>Select the Github issue from those available.</li>
					<li>In the middle box: Select..</li>
					<li>In the middle box: Upload..</li>
					<li>Wait!</li>
					<li>Move the github Issue to <i>Done</i> state</li>
					</ol>
					Know that you've done good in the world.
					</div>
				</div>
			</>) : (<>
				<span className={'notSignedInText'}>You are not signed in</span>
				<a
						href={`/api/auth/signin`}
						className={'buttonPrimary'}
						onClick={(e) => {
							e.preventDefault()
							signIn()
						}}
					>
					Sign in
				</a>
			</>)
			}
		</Layout>   
	)
}

export default App;

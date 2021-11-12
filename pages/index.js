import React, { useRef, useEffect, useState } from "react";
import { signIn, signOut, getSession } from 'next-auth/client'
import Layout from '../components/Layout';
import Uploader from '../components/Uploader';

export async function getServerSideProps({ req, res }) {
	const session = (await getSession({ req })) || process.env.NEXTAUTH_URL === 'http://localhost:3000';
  return {
    props: {
			session,
		},
  }
}

const App = ({ session }) => {
	const [ id, setId ] = useState();
	const [ value, setValue ] = useState();

	// validate Issue - if (getHttpReturnCode('https://github.com/xpollen8/jazzbutcher.com/issues/' + issueNum) <> 200) { // tell them no }

	return (
		<Layout title="Uploader">
			<noscript>
				<style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
			</noscript>
			{(session) ? (<>
				<div className="App">
				<center>
				<b>Github Issue #</b>: <input type="text" name="id" value={value} onChange={(ev) => setId(ev?.target?.value)} />
				</center>
				{id && <Uploader who={session?.user?.email} id={id} value={value} setValue={setValue} />}
				<div>
					<hr/>
					Instructions:
					<ol>
					<li>On github find the issue related to this upload</li>
					<li>Enter the Github issue number in the top box.</li>
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

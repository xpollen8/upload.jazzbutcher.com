import React, { useRef, useEffect, useState } from "react";
import { signIn, signOut, getSession } from 'next-auth/client'
import Layout from '../components/Layout';
import Uploader from '../components/Uploader';

export async function getServerSideProps({ req, res }) {
	const session = await getSession({ req })
  return {
    props: {
			session,
		},
  }
}

const App = ({ session }) => {
	const [ id, setId ] = useState('666');
	const [ value, setValue ] = useState();

	// validate Issue - if (getHttpReturnCode('https://github.com/xpollen8/jazzbutcher.com/issues/' + issueNum) <> 200) { // tell them no }

	return (
		<Layout title="Uploader">
			<noscript>
				<style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
			</noscript>
			{!session && <>
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
			</>}
			{session && <>
				<Uploader id={id} value={value} setValue={setValue} />
				</>
			}
		</Layout>   
	)
}

export default App;

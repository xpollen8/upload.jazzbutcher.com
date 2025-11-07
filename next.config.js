const nextConfig = {
	images: {
	    unoptimized: true,
			remotePatterns: [
				{
					protocol: 'https',
					hostname: 'v1.jazzbutcher.com',
					port: '',
					pathname: '**',
				},
			],
		},
}

module.exports = nextConfig

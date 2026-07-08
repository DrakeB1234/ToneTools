import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			// Automatically prompts the user to update when you push new code
			registerType: 'autoUpdate',
			injectRegister: 'script-defer',

			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: '/',
			},

			// The manifest tells mobile devices how to install your app
			manifest: {
				name: 'Tone Tools',
				short_name: 'ToneTools',
				description: 'Various tools for music theory topics.',
				theme_color: '#2b7fff',
				background_color: '#fff',
				display: 'standalone',
				icons: [
					{
						src: 'pwa-icon-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: 'pwa-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},

			// Workbox handles the actual offline caching
			// Default file size limit is 2mb, may need to increase due to audio files
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,mp3}'],
				navigateFallback: '/',
			}
		})
	]
});

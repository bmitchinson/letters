<script lang="ts">
	import { closedLetter, openLetter } from '$lib/ascii.js';
	import type { Letter } from '../database';

	export let letter: Letter;

	let isOpen = false;

	function toggleLetter() {
		isOpen = !isOpen;
	}
</script>

<div class="flex w-full items-center gap-8" on:click={toggleLetter} role="button" tabindex="0">
	<div class="ascii-art">
		<p>{isOpen ? openLetter : closedLetter}</p>
	</div>

	<div class="letter w">
		<p><strong>to:</strong> {letter.to}</p>
		<p><strong>from:</strong> {letter.from}</p>
		<p class="my-4">
			<em
				>{new Date(letter.created_at).toLocaleDateString('en-US', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})} at {new Date(letter.created_at).toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: '2-digit',
					hour12: true
				})}</em
			>
		</p>
		{#if isOpen}
			<p>{letter.content}</p>
		{/if}
	</div>
</div>

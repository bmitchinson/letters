<script lang="ts">
	import { closedLetter, openLetter } from '$lib/ascii.js';
	import type { Letter } from '../database';
	import { onMount } from 'svelte';

	export let letter: Letter;

	let isOpen = false;

	onMount(() => {
		const savedState = localStorage.getItem(`letter-${letter.id}-open`);
		if (savedState !== null) {
			isOpen = JSON.parse(savedState);
		}
	});

	function toggleLetter() {
		isOpen = !isOpen;
		localStorage.setItem(`letter-${letter.id}-open`, JSON.stringify(isOpen));
	}
</script>

<div class="flex w-full items-start gap-8" on:click={toggleLetter} role="button" tabindex="0">
	<div class="ascii-art">
		<p>{isOpen ? openLetter : closedLetter}</p>
	</div>

	<div class="letter w min-w-0 flex-1">
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
			<p
				style="white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; max-width: 80%;"
			>
				{letter.content}
			</p>
		{/if}
	</div>
</div>

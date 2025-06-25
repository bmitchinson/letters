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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="flex w-full items-start gap-8" on:click={toggleLetter} role="button" tabindex="0">
	<div class="ascii-art mt-[-.7em]">
		<div>{isOpen ? openLetter : closedLetter}</div>
	</div>

	<div>
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
			<p class="max-w-35 break-words whitespace-pre-wrap sm:max-w-90">
				{letter.content}
			</p>
		{/if}
	</div>
</div>

<script lang="ts">
	import { mailBoxWFlagDown, mailBoxWFlagUp } from '../ascii';

	interface Props {
		name: string;
	}

	let { name }: Props = $props();
	let isHovered = $state(false);
</script>

<div
	class="ascii-art"
	on:mouseenter={() => (isHovered = true)}
	on:mouseleave={() => (isHovered = false)}
>
	{@html (isHovered ? mailBoxWFlagUp : mailBoxWFlagDown).replace(
		'{replace}',
		`<span class="${isHovered ? 'text-blue-800 underline' : ''}">${name}</span>`
	)}
</div>

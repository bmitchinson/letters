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
	{(isHovered ? mailBoxWFlagUp : mailBoxWFlagDown).replace('{replace}', name)}
</div>

<script>
  import Map from "./components/Map.svelte";
  import goods from "./services/goods";

  import { get } from "./services/get";
  import { selected, data } from "./state/goods.state.js";

  let topTenCountries;
  let topTen;
  let hover = null;

  async function getData({ url, value }) {
    const res = await get(url, value);

    data.set(res.data);
  }

  function setSelected(tab) {
    selected.set(tab);
  }

  function onHover(country) {
    hover = country.id;
  }

  selected.set(goods[0]);

  selected.subscribe(good => {
    getData(good);
  });

  data.subscribe(data => {
    topTen = data.slice(0, 10);
  });
</script>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .app {
    height: 100vh;
    max-width: 100%;

    display: flex;
    flex-direction: column;
  }

  .content {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }

  .sidebar {
    padding: 0 16px;
  }

  ol {
    width: 100%;
    padding: 10px;
    line-height: 30px;
  }
  li {
    border-bottom: 1px solid #222;
  }

  li:hover {
    background: #ccc;
  }

  .active {
    background: #9d0000;
  }

  button:hover {
    background: #9d0000;
  }
  button {
    border: 0;
    padding: inherit 8px;
    background: #c50000;
    color: #fff;
    margin-right: 8px;
  }

  .tabs {
    padding: 8px;
  }
  @media (min-size: 768px) {
    .app {
      flex-direction: row;
    }
  }
</style>

<svelte:options tag="watch-import-map" />

<main class="app">
  <div class="tabs">
    {#each goods as tab}
      <button
        on:click={() => setSelected(tab)}
        class:active={$selected.name === tab.name}>
        {tab.name}
      </button>
    {/each}
  </div>
  <section class="content">
    <Map {hover} {selected} />
  </section>
  <aside class="sidebar">
    <h1>Top ten</h1>

    <ol bind:this={topTenCountries}>
      {#each topTen as country}
        <li
          on:mouseover={e => onHover(country)}
          on:mouseleave={() => (hover = null)}>
          {country.name} {country.currency}
        </li>
      {/each}
    </ol>
  </aside>
</main>

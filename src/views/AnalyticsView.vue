<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { getEvents, getRollups, type ActionEvent, type RollupBucket, type RollupInterval } from "../api/analytics";
import { listHopups, type Hopup } from "../api/hopups";

const props = defineProps<{ siteId: string }>();

const hopups = ref<Hopup[]>([]);
const hopupId = ref<string | undefined>(undefined);
const from = ref<string>("");
const to = ref<string>("");
const interval = ref<RollupInterval>("hour");

const events = ref<ActionEvent[]>([]);
const rollups = ref<RollupBucket[]>([]);
const loading = ref(true);

const chartData = computed(() => ({
  labels: rollups.value.map((bucket) => bucket.intervalStart),
  datasets: [
    {
      label: "Actions shown",
      data: rollups.value.map((bucket) => bucket.count)
    }
  ]
}));

async function refetch(): Promise<void> {
  loading.value = true;
  const filter = {
    siteId: props.siteId,
    hopupId: hopupId.value,
    from: from.value || undefined,
    to: to.value || undefined
  };
  const [eventsResult, rollupsResult] = await Promise.all([
    getEvents(filter),
    getRollups({ ...filter, interval: interval.value })
  ]);
  events.value = eventsResult;
  rollups.value = rollupsResult;
  loading.value = false;
}

onMounted(async () => {
  hopups.value = await listHopups(props.siteId);
  await refetch();
});

watch([hopupId, from, to, interval], refetch);

defineExpose({ refetch });
</script>

<template>
  <div class="analytics-view">
    <h1>Analytics</h1>

    <div class="filters">
      <Select
        v-model="hopupId"
        :options="hopups"
        option-label="id"
        option-value="id"
        placeholder="All hopups"
        show-clear
        data-testid="hopup-filter"
      />
      <input type="datetime-local" v-model="from" data-testid="from-filter" />
      <input type="datetime-local" v-model="to" data-testid="to-filter" />
      <Select v-model="interval" :options="['minute', 'hour', 'day']" data-testid="interval-filter" />
    </div>

    <div v-if="loading" class="loading-state" data-testid="loading-state">Loading&hellip;</div>
    <div v-else-if="rollups.length === 0" class="empty-state" data-testid="chart-empty-state">
      No data in range.
    </div>
    <Chart v-else type="bar" :data="chartData" data-testid="rollup-chart" />

    <h3>Events</h3>
    <table data-testid="events-table">
      <thead>
        <tr>
          <th>Hopup</th>
          <th>Action</th>
          <th>Visitor</th>
          <th>Session</th>
          <th>Shown at</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="event in events" :key="event.id" data-testid="event-row">
          <td>{{ event.hopupId }}</td>
          <td>{{ event.actionId }}</td>
          <td>{{ event.visitorId }}</td>
          <td>{{ event.sessionId }}</td>
          <td>{{ event.shownAt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

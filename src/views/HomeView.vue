<script setup lang="ts">
import AlertList from '@/components/AlertList.vue'
import LoadList from '@/components/LoadList.vue'
import { useCpuStore, type CpuItem } from '@/stores/cpu'
import { computed } from 'vue'

const TEN_MINUTES = 10 * 60 * 1000
const WARNING_COLOR = '#ecc005'
const HIGH_COLOR = '#FF4560'
const RECOVER_COLOR = '#00E396'
const WHITE_COLOR = '#fff'

const store = useCpuStore()

const currentAverage = computed(() => {
  if (!store.cpuHistory.length) {
    return 'N/A'
  }

  return store.cpuHistory[0].normalizedLoadAverage.toFixed(2)
})

const data = computed(() => {
  return store.cpuHistory?.toReversed().map((item: CpuItem) => {
    return {
      x: item.timestamp,
      y: item.normalizedLoadAverage,
    }
  })
})

const series = computed(() => [
  {
    name: 'Load average',
    data: data.value,
  },
])
const chartOptions = computed(() => {
  const now = series.value[0].data[0]?.x || Date.now()

  return {
    chart: {
      zoom: {
        enabled: true,
      },
      id: 'realtime',
      height: 350,
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000,
        },
      },
    },
    tooltip: {
      x: {
        show: true,
        format: 'HH:mm:ss',
        formatter: undefined,
      },
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: 'CPU Chart (Updating)',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: '600',
        fontFamily: 'Montserrat',
      },
    },
    xaxis: {
      type: 'datetime',
      format: 'HH:mm:ss',
      min: now,
      max: now + TEN_MINUTES,
    },
    yaxis: {
      min: 0,
      show: true,
      max: function (value: number) {
        if (value) {
          return Math.max(parseFloat(value.toFixed(2)), 2)
        }

        return 2
      },
      labels: {
        formatter: function (value: string) {
          return parseFloat(value).toFixed(2)
        },
      },
    },
    legend: {
      show: false,
    },
    annotations: {
      yaxis: [
        {
          y: 1,
          borderColor: WARNING_COLOR,
          label: {
            borderColor: WARNING_COLOR,
            style: {
              color: WHITE_COLOR,
              background: WARNING_COLOR,
            },
            text: 'CPU High Load',
          },
        },
      ],
      xaxis: store.alertHistory.map((item) => {
        return {
          x: item.startTimestamp || data.value[0].x,
          x2: item.endTimestamp || data.value.slice(-1)[0]?.x,
          fillColor: HIGH_COLOR,
          opacity: 0.4,
        }
      }),
      points: [
        ...store.alertHistory.map((item) => {
          return {
            x: item.startTimestamp,
            y: item.startAverageLoad,
            label: {
              borderColor: HIGH_COLOR,
              offsetY: 0,
              style: {
                color: WHITE_COLOR,
                background: HIGH_COLOR,
              },
              text: 'High Load',
            },
          }
        }),
        ...store.alertHistory
          .filter((item) => item.endTimestamp)
          .map((item) => {
            return {
              x: item.endTimestamp,
              y: item.endAverageLoad,
              label: {
                borderColor: RECOVER_COLOR,
                offsetY: 0,
                style: {
                  color: WHITE_COLOR,
                  background: RECOVER_COLOR,
                },
                text: 'Recovered',
              },
            }
          }),
      ],
    },
  }
})
</script>

<template>
  <div class="home-page">
    <div
      class="home-page__header"
      :class="{ 'home-page__header--warning': store.isUnderHeavyLoad }"
    >
      <div class="home-page__section">
        <span class="home-page__title"> Current load average: </span>
        <span class="home-page__subtitle">
          {{ currentAverage }}
        </span>
      </div>
      <div class="home-page__section">
        <span class="home-page__title"> Is under heavy load: </span>
        <span class="home-page__subtitle">
          {{ store.isUnderHeavyLoad ? 'Yes' : 'No' }}
        </span>
      </div>
    </div>

    <div class="home-page__main">
      <apexchart
        ref="chart"
        type="line"
        height="350"
        :options="chartOptions"
        :series="series"
        class="home-page__card"
      />

      <div class="home-page__row">
        <div class="home-page__card home-page__section">
          <LoadList />
        </div>
        <div class="home-page__card home-page__section">
          <AlertList />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  &__main {
    display: flex;
    flex-flow: column;
    row-gap: 32px;
  }

  &__row {
    display: flex;
    flex-flow: row;
    column-gap: 32px;
  }

  &__header {
    @include card;

    text-align: left;
    display: flex;
    margin-bottom: 32px;

    &--warning {
      background: color($negative, 20%);
    }
  }

  &__section {
    width: 50%;
    padding-right: 16px;
    display: flex;
    flex-flow: row;
  }

  &__card {
    @include card;

    display: flex;
  }

  &__title {
    @include title;
  }

  &__subtitle {
    @include title($secondary);

    padding-left: 8px;
  }

  .books-list {
    margin-top: 32px;
  }

  @include media('<=laptop') {
    &__row {
      flex-flow: column;
      row-gap: 32px;
    }

    &__section {
      width: 100%;
    }

    .book-item {
      width: 100%;
    }
  }

  :deep(.vue-apexcharts) {
    @include zIndex;

    padding: 32px 24px;
  }
}
</style>

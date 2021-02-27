<template>
  <b-container>
    <chart
      v-if="chartData.datasets && chartData.datasets.length"
      :chartData="chartData"
      :options="chartOptions"
    />
  </b-container>
</template>

<script>
import Chart from "./Chart";
export default {
  name: "MemeStatistics",
  components: {
    Chart,
  },
  props: {
    upvoteDates: Array,
    downvoteDates: Array,
    viewDates: Array,
    viewAfterCreationDates: Array,
    generatedDates: Array,
  },
  data() {
    return {
      chartData: {},
      chartOptions: {},
      statsLoaded: false,
    };
  },
  watch: {
    upvoteDates() {
      this.prepareChartData();
    },
    downvoteDates() {
      this.prepareChartData();
    },
  },
  methods: {
    createChartDataFromDates(fixedDates, dates) {
      return fixedDates.map((fixedDate) => ({
        x: fixedDate,
        y: dates.filter((date) => {
          const endDate = new Date(fixedDate);
          endDate.setDate(endDate.getDate() + 1);
          return date >= fixedDate && date <= endDate;
        }).length,
      }));
    },
    filterDates(fixedDates, dates) {
      return dates
        .map((date) => new Date(date))
        .filter(
          (date) =>
            date <= fixedDates[0] && date >= fixedDates[fixedDates.length - 1]
        );
    },
    prepareChartData() {
      const dates = [-1, 0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() - i);
        return date;
      });

      const datasets = [
        ["views", this.viewDates, "#427A82", "rgb(105,150,156,0.7)"],
        ["upvotes", this.upvoteDates, "#8ABD5F", "rgb(185, 227, 151, 0.7)"],
        ["downvotes", this.downvoteDates, "#D4A76A", "rgb(255, 219, 170, 0.7)"],
        [
          "sum of memes using this template",
          this.generatedDates,
          "#D48A6A",
          "rgb(255, 195, 170, 0.7)",
        ],
        [
          "sum of meme views using this template",
          this.viewAfterCreationDates,
          "#C36279",
          "rgb(234, 156, 174, 0.7)",
        ],
      ].map(([label, data, color, bgColor]) => {
        return {
          data: this.createChartDataFromDates(
            dates,
            this.filterDates(dates, data)
          ),
          label,
          borderColor: color,
          pointBackgroundColor: color,
          lineTension: 0.3,
          backgroundColor: bgColor,
        };
      });

      this.fillChartData(datasets);
      this.statsLoaded = true;
    },
    fillChartData(datasets) {
      this.chartData = {
        labels: [],
        datasets,
      };

      this.chartOptions = {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
              },
            },
          ],
        },
      };
    },
  },
  mounted() {
    this.prepareChartData();
  },
};
</script>

<style scoped>
</style>
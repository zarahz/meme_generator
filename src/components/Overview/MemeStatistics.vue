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
import Chart from "../Stats/Chart";
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
      //     {
      //     responsive: true,
      //     maintainAspectRatio: false,
      //   }
      chartData: {},
      chartOptions: {},
      statsLoaded: false,
    };
  },
  methods: {
    getParsedDates(dateArray) {
      let parsedDateArray = dateArray.sort().map((date) => {
        //parse!
        return new Date(date).getMinutes(); //.toDateString();
      });
      return this.removeDuplicates(parsedDateArray);
    },
    removeDuplicates(array) {
      return array.reduce(function (a, b) {
        //remove duplicates
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);
    },
    countOccurences(dateArray) {
      //key is date and value are the occurences
      let occurenceObject = {};
      dateArray.forEach((date) => {
        let parsedDate = new Date(date).getMinutes(); //.toDateString();
        occurenceObject[parsedDate] = occurenceObject[parsedDate]
          ? occurenceObject[parsedDate] + 1
          : 1;
      });
      return occurenceObject;
    },
    fillOccurence(label, occurenceObject) {
      if (!Object.keys(occurenceObject).includes(label)) {
        occurenceObject[label] = 0;
      }
      return occurenceObject;
    },
    prepareChartData() {
      const upvoteDates = this.getParsedDates(this.upvoteDates);
      const downvoteDates = this.getParsedDates(this.downvoteDates);
      const viewDates = this.getParsedDates(this.viewDates);
      const viewAfterCreationDates = this.getParsedDates(
        this.viewAfterCreationDates
      );
      const generatedDates = this.getParsedDates(this.generatedDates);

      let upvoteCount = this.countOccurences(this.upvoteDates);
      let downvoteCount = this.countOccurences(this.downvoteDates);
      let viewCount = this.countOccurences(this.viewDates);
      let viewAfterCreationCount = this.countOccurences(
        this.viewAfterCreationDates
      );
      let generatedCount = this.countOccurences(this.generatedDates);

      //merge all dates to create labels
      let labels = [
        ...upvoteDates,
        ...downvoteDates,
        ...viewDates,
        ...viewAfterCreationDates,
        ...generatedDates,
      ].sort(function (a, b) {
        return a - b; //new Date(b.date) - new Date(a.date);
      });

      labels = this.removeDuplicates(labels);

      //fill missing values with zero for each occurence object
      labels.forEach((label) => {
        const stringLabel = "" + label;
        upvoteCount = this.fillOccurence(stringLabel, upvoteCount);
        downvoteCount = this.fillOccurence(stringLabel, downvoteCount);
        viewCount = this.fillOccurence(stringLabel, viewCount);
        viewAfterCreationCount = this.fillOccurence(
          stringLabel,
          viewAfterCreationCount
        );
        generatedCount = this.fillOccurence(stringLabel, generatedCount);
      });

      this.fillChartData(
        labels,
        upvoteCount,
        downvoteCount,
        viewCount,
        viewAfterCreationCount,
        generatedCount
      );
      this.statsLoaded = true;
    },
    fillChartData(
      labels,
      upvoteCount,
      downvoteCount,
      viewCount,
      viewAfterCreationCount,
      generatedCount
    ) {
      this.chartData = {
        labels: labels,
        datasets: [
          {
            label: "upvotes",
            data: Object.values(upvoteCount),
            backgroundColor: "rgba(253, 196, 190, 0.4)",
            borderColor: "#FC7F72",
            lineTension: 0,
            pointBackgroundColor: "#FC7F72",
          },
          {
            label: "downvotes",
            data: Object.values(downvoteCount),
            backgroundColor: "rgba(124, 253, 197, 0.4)",
            borderColor: "#30FCA4",
            lineTension: 0,
            pointBackgroundColor: "#30FCA4",
          },
          {
            label: "views",
            data: Object.values(viewCount),
            backgroundColor: "rgba(122,0,61, 0.4)",
            borderColor: "#470024",
            lineTension: 0,
            pointBackgroundColor: "#470024",
          },
          {
            label: "views of memes using this template",
            data: Object.values(viewAfterCreationCount),
            backgroundColor: "rgba(253, 235, 134, 0.4)",
            borderColor: "#CCB52F",
            lineTension: 0,
            pointBackgroundColor: "#CCB52F",
          },
          {
            label: "memes generated using this template",
            data: Object.values(generatedCount),
            backgroundColor: "rgba(84, 130, 255, 0.4)",
            borderColor: "#0749FF",
            lineTension: 0,
            pointBackgroundColor: "#0749FF",
          },
        ],
      };

      this.chartOptions = {
        maintainAspectRatio: false,
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
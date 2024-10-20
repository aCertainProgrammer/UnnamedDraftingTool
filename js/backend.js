class Backend {
  constructor() { }
  requestVisibleChampions(request) {
    let data = [];
    switch (request.team) {
      case "all":
        data = all_champions_data;
        break;
      case "leo":
        data = leo_data;
        break;
      case "enemy":
        data = enemy_data;
        break;
    }
    if (request.role == "all") {
      data = data["top"].concat(
        data["jungle"],
        data["mid"],
        data["adc"],
        data["support"],
      );
      data = this.sortAndRemoveDuplicates(data);
    } else {
      data = this.sortAndRemoveDuplicates(data[request.role]);
    }
    data = this.filterDataBySearchQuery(data, request.search);
    return data;
  }
  sortAndRemoveDuplicates(data) {
    data.sort();
    const newData = [];
    newData.push(data[0]);
    for (let i = 1; i < data.length; i++) {
      if (data[i - 1] != data[i]) {
        newData.push(data[i]);
      }
    }
    return newData;
  }
  filterDataBySearchQuery(data, search_query) {
    if (search_query == "") return data;
    const newData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].toLowerCase().includes(search_query.toLowerCase())) {
        newData.push(data[i]);
      }
    }
    return newData;
  }
}

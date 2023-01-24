<template>
  <div class="xl:p-0 p-10 h-screen max-w-screen-2xl mx-auto">
    <div class="mb-auto xl:m-5">
      <div class="sm:flex sm:items-center sm:justify-between my-5">
        <div
          @click="reloadPage"
          class="font-bold text-2xl text-white cursor-pointer"
        >
          <img class="h-10" src="/Netflix_logo.svg" alt="Netflix logo" />
        </div>
        <div class="flex items-center">
          <h1
            class="text-white font-bold mr-5 animate-pulse"
            v-if="searchResults.length == 0"
          >
            Need a more specific search, try again...
          </h1>
          <h1
            v-else-if="searchInput.search != ''"
            class="text-white font-bold mr-5"
          >
            {{ searchResults.length }} / {{ searchAllResults.length }} results
            found
          </h1>
          <div class="w-70 sm:m-0 mt-5">
            <div>
              <div class="flex bg-white rounded-2 px-5 py-2">
                <input
                  @click="dropdownText = 'Select Director'"
                  type="text"
                  v-model="searchInput.search"
                  :placeholder="searchSuggestion"
                  class="focus:outline-none w-full"
                />
                <button class="text-black font-bold" @click="searchData">
                  <Search class="h-5 text-netflix" />
                </button>
              </div>
              <div
                class="
                  z-10
                  absolute
                  w-70
                  bg-grey
                  divide-y divide-dark-800
                  rounded
                "
              >
                <div v-if="searchInput.search != ''">
                  <ul
                    class="py-1 text-sm text-white"
                    v-if="searchSuggestions.length > 0"
                  >
                    <li v-for="s of searchSuggestions" :key="s">
                      <a
                        href="#"
                        @click="searchInput.search = s"
                        class="block font-medium px-4 py-2 hover:text-netflix"
                        >{{ s }}</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sm:flex justify-between">
        <div class="w-60 mr-5 p-5 h-min rounded-2 bg-dark-800 mb-5 sm:mb-0">
          <h1 class="text-bordeaux font-bold text-xl mb-5 flex items-center">
            <Filter class="mr-1" /> Filter
          </h1>
          <h2 class="font-bold mb-1 text-netflix">TYPES</h2>
          <div class="flex items-center" v-for="t of types" :key="t">
            <input
              type="checkbox"
              @click="dropdownText = 'Select Director'"
              v-model="filterInputType[t]"
              class="
                cursor-pointer
                w-4
                h-4
                bg-grey
                rounded
                focus:ring-netflix
                hover:ring-netflix
                my-2
              "
            />
            <label class="ml-2 text-sm font-medium text-white">{{ t }}</label>
          </div>
          <h2 class="text-netflix font-bold mb-1 mt-5">SORT ON RELEASE</h2>
          <div class="flex text-white font-medium space-x-5">
            <div
              class="flex cursor-pointer"
              @click="
                filterInputType.asc == true
                  ? (filterInputType.desc = false)
                  : (filterInputType.asc = true),
                  (dropdownText = 'Select Director')
              "
            >
              <div class="flex items-center" v-if="sort == 'release_year asc'">
                <SortAsc class="rotate-180 text-red" /> ASC
              </div>
              <div class="flex items-center" v-else>
                <SortAsc class="rotate-180" /> ASC
              </div>
            </div>
            <div
              class="flex cursor-pointer"
              @click="
                filterInputType.desc == true
                  ? (filterInputType.asc = false)
                  : (filterInputType.desc = true),
                  (dropdownText = 'Select Director')
              "
            >
              <SortDesc />DESC
            </div>
          </div>
          <h2 class="text-netflix font-bold mb-1 mt-5">DIRECTOR</h2>
          <div class="relative">
            <button
              class="
                flex
                items-center
                justify-around
                bg-dark-400
                w-48
                text-white
                py-2
                rounded-2
                font-medium
              "
              @click="showDropdown = !showDropdown"
            >
              {{ dropdownText }}
              <ChevronDown class="h-5" v-if="showDropdown != true" />
              <ChevronUp class="h-5" v-else />
            </button>
            <div
              v-if="showDropdown"
              class="
                absolute
                z-10
                h-50
                mt-2
                py-2
                w-48
                bg-dark-400
                rounded-md
                shadow-md
                overflow-y-auto
              "
            >
              <a
                v-if="dropdownText != 'Select Director'"
                @click="
                  (dropdownText = 'Select Director'),
                    (showDropdown = false),
                    searchData()
                "
                href="#"
                class="
                  block
                  px-4
                  py-3
                  text-sm text-red-500
                  hover:text-bordeaux
                  font-medium
                  border-b-1 border-dark-200
                "
              >
                Remove selection
              </a>
              <a
                @click="
                  (dropdownText = d),
                    (showDropdown = false),
                    (searchInput.search = ''),
                    searchDirector(d)
                "
                v-for="d of searchAllDirectors"
                :key="d"
                href="#"
                class="
                  block
                  px-4
                  py-3
                  text-sm text-white
                  hover:text-bordeaux
                  font-medium
                "
              >
                {{ d }}
              </a>
            </div>
          </div>
        </div>

        <div
          class="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-10 mb-10"
          v-if="searchResults.length > 0"
        >
          <div
            v-for="result of searchResults"
            :key="result.title"
            class="
              max-w-sm
              min-w-55
              p-6
              bg-dark-800
              rounded-lg
              shadow-md
              relative
            "
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center text-white">
                <Tv v-if="result.type == 'TV Show'" class="my-2 mr-1" />
                <Clapperboard v-else class="my-2 mr-1" />
                <p class="align-baseline">{{ result.type }}</p>
              </div>
              <p class="text-grey font-bold">{{ result.release_year }}</p>
            </div>

            <h5 class="mb-2 text-2xl font-semibold tracking-tight text-netflix">
              {{ result.title }}
            </h5>

            <p class="mb-3 font-normal text-light-900">
              {{ result.description }}
            </p>
            <div class="mt-5">
              <h1 class="font-bold text-white">CATEGORY</h1>
              <p class="font-medium text-bordeaux">
                {{ result.listed_in }}
              </p>
            </div>
            <div class="mt-2 flex text-light-900 font-medium items-center">
              <Clock class="mr-1 h-5" /> {{ result.duration }}
            </div>
            <div
              class="text-grey float-right my-5"
              v-if="result.director != null"
            >
              <p
                class="absolute bottom-0 right-0 p-5 font-bold"
                v-if="result.director.length < 30"
              >
                <span class="font-medium"> Made by </span>
                {{ result.director }}
              </p>
            </div>
            <div class="text-grey float-right my-5" v-else>
              <p class="absolute bottom-0 right-0 p-5 font-bold">
                <span class="font-medium"> No director found </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center py-10" v-if="searchResults.length > 15">
      <div class="inline-flex">
        <button
          @click="previousPage"
          class="
            bg-dark-800
            hover:bg-netflix
            text-white
            font-bold
            py-2
            px-4
            rounded-l
          "
        >
          Prev
        </button>
        <button
          @click="nextPage"
          class="
            bg-dark-800
            hover:bg-netflix
            font-bold
            py-2
            text-white
            px-4
            rounded-r
          "
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";
import { ref, reactive, watch } from "vue";
import {
  Clapperboard,
  Tv,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-vue-next";

export default {
  components: {
    Clapperboard,
    Tv,
    Search,
    Filter,
    SortAsc,
    SortDesc,
    Clock,
    ChevronDown,
    ChevronUp,
  },
  setup() {
    // Azure Search Setup
    const apiKey = import.meta.env.VITE_SEARCH_KEY;
    const enpoint = import.meta.env.VITE_SEARCH_ENDPOINT;
    const index = import.meta.env.VITE_SEARCH_INDEX;

    const searchClient = new SearchClient(
      enpoint,
      index,
      new AzureKeyCredential(apiKey)
    );

    // Variables
    let skipvalue = 0;
    let takevalue = 18;

    let types = [];
    let filter = ref("");
    let sort = ref("");

    let searchResults = ref([]);
    let searchSuggestion = ref("Search with Azure...");
    let searchSuggestions = ref([]);

    let searchAllResults = ref([]);
    let searchAllDirectors = ref([]);

    let headerText = ref("");

    let showDropdown = ref(false);
    let dropdownText = ref("Select Director");

    // Reactive
    const filterInputType = reactive({
      TVShow: false,
      Movie: false,
      asc: false,
      desc: false,
    });

    const searchInput = reactive({
      search: "",
    });

    // Searchers
    const searchData = async () => {
      let options = {
        top: takevalue,
        skip: skipvalue,
        filter: filter.value,
        orderBy: [sort.value],
        searchFiels: "title",
      };
      const searchQuery = await searchClient.search(
        searchInput.search,
        options
      );
      searchResults.value = [];
      for await (const result of searchQuery.results) {
        searchResults.value.push(result.document);

        // Add type to filter
        let type = result.document.type.split(" ").join("");
        if (!types.includes(type)) {
          types.push(type);
        }
      }
    };

    const searchAllData = async () => {
      const searchAllQuery = await searchClient.search(searchInput.search, {
        searchField: "title",
      });
      searchAllResults.value = [];
      for await (const result of searchAllQuery.results) {
        if (searchAllResults.value.length > 499) break;
        searchAllResults.value.push(result.document);
      }
    };

    const searchDirectors = async () => {
      const searchDirectorsQuery = await searchClient.search("");
      searchAllDirectors.value = [];
      for await (const result of searchDirectorsQuery.results) {
        if (!searchAllDirectors.value.includes(result.document.director))
          searchAllDirectors.value.push(result.document.director);
      }
    };

    const searchDirector = async (d) => {
      let options = {
        top: takevalue,
        skip: skipvalue,
        searchField: "director",
      };
      const searchDirectorQuery = await searchClient.search(d, options);
      searchResults.value = [];
      for await (const result of searchDirectorQuery.results) {
        searchResults.value.push(result.document);
      }
    };

    const searchSuggestionsData = async () => {
      const searchQuery = await searchClient.suggest(searchInput.search, "sg");
      searchSuggestion.value = "";
      searchSuggestions.value = [];
      for await (const result of searchQuery.results) {
        searchSuggestion.value = result.text;
        searchSuggestions.value.push(result.text);
      }
    };

    // Watchers
    watch(searchInput, () => {
      if (searchInput.search != "") {
        searchSuggestionsData();
      }
      sort.value = "";
      searchData();
      searchAllData();
    });

    watch(filterInputType, () => {
      if (filterInputType.TVShow == true && filterInputType.Movie == true) {
        filter.value = `type eq 'TV Show' or type eq 'Movie'`;
      } else if (filterInputType.TVShow == true) {
        filter.value = `type eq 'TV Show'`;
      } else if (filterInputType.Movie == true) {
        filter.value = `type eq 'Movie'`;
      } else {
        filter.value = "";
      }
      if (filterInputType.asc == true) {
        sort.value = `release_year asc`;
      }
      if (filterInputType.desc == true) {
        sort.value = `release_year desc`;
      }
      searchData();
    });

    // Pagination
    const nextPage = () => {
      skipvalue += takevalue;
      searchData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const reloadPage = () => {
      window.location.reload();
    };

    const previousPage = () => {
      if (skipvalue >= takevalue) {
        skipvalue -= takevalue;
      }
      searchData();
    };

    // Show all results on load
    searchDirectors();
    searchData();

    return {
      searchData,
      searchAllData,
      searchDirectors,
      searchDirector,

      nextPage,
      previousPage,
      reloadPage,

      searchResults,
      searchAllResults,
      searchAllDirectors,

      searchSuggestion,
      searchSuggestions,

      searchInput,

      filterInputType,
      types,
      headerText,

      showDropdown,
      dropdownText,
    };
  },
};
</script>

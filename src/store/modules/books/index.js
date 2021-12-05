import mutations from "./mutations.js"
import actions from "./actions.js"
import getters from "./getters.js"

export default {
  namespaced: true,
  state() {
    return {
      books: [
        {
          id: "b1",
          title: "Crime and Punishment",
          author: "Fyodor Dostoevsky",
          logo: require("@/assets/book_logos/cap.jpg"),
          genres: ["Fiction", "Russian literature"],
          page_num: 671,
          added_date: new Date("2021-11-15"),
          copies: [
            {
              id: "c1",
              inventoryNumber: "76921",
              status: "Available",
            },
            {
              id: "c2",
              inventoryNumber: "89832",
              status: "Available",
            },
            {
              id: "c3",
              inventoryNumber: "26008",
              status: "Reserved",
            },
            {
              id: "c4",
              inventoryNumber: "671889",
              status: "Loaned",
            },
          ],
          reviews: [
            {
              id: "r1",
              userId: "u1",
              rating: 5,
              title: "One of my all time favorite novels!",
              comment:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et ducimus vero voluptates nam repudiandae quos, eos non sequi! Autem officiis sed ut laborum magnam architecto veritatis, mollitia aspernatur quaerat ducimus!",
            },
            {
              id: "r2",
              userId: "u2",
              rating: 5,
              title: "Fascinating",
              comment:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et ducimus vero voluptates nam repudiandae quos, eos non sequi! Autem officiis sed ut laborum magnam architecto veritatis, mollitia aspernatur quaerat ducimus!",
            },
            {
              id: "r3",
              userId: "u3",
              rating: 4,
              title: "Good book",
              comment:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et ducimus vero voluptates nam repudiandae quos, eos non sequi! Autem officiis sed ut laborum magnam architecto veritatis, mollitia aspernatur quaerat ducimus!",
            },
          ],
        },
        {
          id: "b2",
          title: "Harry Potter and the Sorcerer's Stone",
          author: "J.K. Rowling",
          logo: require("@/assets/book_logos/harrypotter.jpg"),
          genres: ["Fiction", "Fantasy"],
          page_num: 309,
          added_date: new Date("2021-11-16"),
          copies: [
            {
              id: "c1",
              inventoryNumber: "76921",
              status: "Available",
            },
          ],
        },
        {
          id: "b3",
          title: "Steve Jobs",
          author: "Walter Isaacson",
          logo: require("@/assets/book_logos/stevejobs.jpg"),
          genres: ["Biography", "Nonfiction"],
          page_num: 627,
          added_date: new Date("2021-11-17"),
          copies: [
            {
              id: "c1",
              inventoryNumber: "76921",
              status: "Available",
            },
            {
              id: "c2",
              inventoryNumber: "76921",
              status: "Available",
            },
            {
              id: "c3",
              inventoryNumber: "76921",
              status: "Reserved",
            },
          ],
        },
        {
          id: "b4",
          title: "Sapiens: A Brief History of Humankind",
          author: "Yuval Noah Harari",
          logo: require("@/assets/book_logos/sapiens.jpg"),
          genres: ["Nonfiction", "History", "Science"],
          page_num: 512,
          added_date: new Date("2021-11-18"),
          copies: [
            {
              id: "c1",
              inventoryNumber: "76921",
              status: "Available",
            },
            {
              id: "c2",
              inventoryNumber: "76921",
              status: "Loaned",
            },
          ],
        },
      ],
    }
  },
  mutations,
  actions,
  getters,
}

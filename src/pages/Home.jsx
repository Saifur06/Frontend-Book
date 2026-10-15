import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Book from "../components/Book";

const getErrorMessage = (error) => error.response?.data?.message || "Please try again."

const Home = () => {
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [allBooks, setAllBooks] = useState([])

    const fetchBooks = async () => {
        try {
            const response = await axios.get("https://bookshelf-manager-02.vercel.app/all-books")
            setAllBooks(response.data.data || [])
        } catch (error) {
            toast.error(`Could not load books. ${getErrorMessage(error)}`)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await axios.post("https://bookshelf-manager-02.vercel.app/add-book", { title, author })
            toast.success("Books added successfully")
            setTitle("")
            setAuthor("")
            await fetchBooks()
        } catch (error) {
            toast.error(`Could not add book. ${getErrorMessage(error)}`)
        }
    }

    const handleStatusUpdate = async (bookId, status) => {
        if (!bookId) return

        try {
            await axios.patch(`https://bookshelf-manager-02.vercel.app/books/${bookId}/status`, { status })
            toast.success(`Book marked as ${status}`)
            await fetchBooks()
        } catch (error) {
            toast.error(`Could not update book status. ${getErrorMessage(error)}`)
        }
    }

    const handleDeleteBook = async (bookId) => {
        if (!bookId) return

        try {
            await axios.delete(`https://bookshelf-manager-02.vercel.app/books/${bookId}`)
            toast.success("Book deleted successfully")
            await fetchBooks()
        } catch (error) {
            toast.error(`Could not delete book. ${getErrorMessage(error)}`)
        }
    }

    useEffect(() => {
        axios.get("https://bookshelf-manager-02.vercel.app/all-books")
            .then((response) => setAllBooks(response.data.data || []))
            .catch((error) => toast.error(`Could not load books. ${getErrorMessage(error)}`))
    }, [])

    return (
    <div className="max-w-7xl mx-auto mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 grid grid-cols-2 gap-6">
        <div className="rounded-2xl border border-violet-200 bg-white p-7 shadow-md">
            <ToastContainer />
            <h1 className="text-3xl font-extrabold text-indigo-950 mb-6 tracking-tight"> MY ASSET </h1>
            <form action="" className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-semibold text-indigo-900">Book Name : </label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Enter book title"
                        name="Title"
                        className="w-full max-w-md border border-violet-200 rounded-lg p-3 text-slate-800 bg-violet-50/30 outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="author" className="text-sm font-semibold text-indigo-900">Writer Name : </label>
                    <input
                        id="author"
                        type="text"
                        placeholder="Enter author name"
                        name="author"
                        className="w-full max-w-md border border-violet-200 rounded-lg p-3 text-slate-800 bg-violet-50/30 outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full max-w-md rounded-lg bg-indigo-700 px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-indigo-800 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                >
                    Add This In Your Shelf
                </button>
            </form>
        </div>
        <div className="space-y-4 pl-2">
            <h2 className="text-2xl font-bold text-indigo-950 mb-4 border-b border-indigo-200 pb-3"> All Books List</h2>
            {allBooks.map((ab) => (
                <Book key={ab._id} ab={ab} handleStatusUpdate={handleStatusUpdate} handleDeleteBook={handleDeleteBook} />
            ))}
        </div>
    </div>
);
};
export default Home;
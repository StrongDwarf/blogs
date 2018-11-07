# blogs_design
Specifies the order of loading pages in the blog, and the format of the front and back data is returned
---------------------------------------
## Page loading sequence
When users enter the blog homepage, the order of loading pages is as follows
1. Loading the first screen CSS style
2. Loading the first screen HTML code and data of the home page
3. Loading the remaining styles and code of the home page
4. Loading data on the next page
5. Loading blog article page templates and styles
6. Load the homepage data of the article showing the title of the article on the current page for users to quickly jump to the details page after clicking on the title of the blog article
Page loading sequence just like this:
    <script src="first screen CSS style"></script>
    <script src="sirst screen HTML code and data"></script>
    <script src="remaining styles and code of the home page"></script>
    <script src="next page data"></script>
    <script src="article page templates and styles"></script>
    <script src="article details page first screen data">
---------------------------------------
## Data transmission format
#### first screen data
    


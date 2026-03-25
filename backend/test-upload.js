import dotenv from "dotenv"
dotenv.config()

// Use dynamic import to ensure dotenv.config() runs first
async function runTest() {
    const { default: uploadOnCloudinary } = await import("./config/cloudinary.js")
    const fs = await import("fs")
    const path = await import("path")

    console.log("Testing Cloudinary Upload...")
    console.log("Cloud Name:", process.env.CLOUD_NAME)
    
    const testFilePath = path.join(process.cwd(), "test-file.txt")
    fs.writeFileSync(testFilePath, "This is a test file for Cloudinary upload validation.")
    
    try {
        const url = await uploadOnCloudinary(testFilePath)
        if (url) {
            console.log("✅ Upload Successful!")
            console.log("URL:", url)
        } else {
            console.log("❌ Upload Failed (Returned Null)")
        }
    } catch (error) {
        console.error("❌ Test Script Error:", error.message)
    } finally {
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath)
        }
    }
}

runTest()

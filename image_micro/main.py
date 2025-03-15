from flask import Flask, request, jsonify
from PIL import Image, ExifTags
import numpy as np
import cv2
from io import BytesIO

app = Flask(__name__)

def get_exif_data(image):
    try:
        exif_data = image._getexif()
        extracted = {}
        gps_data = {}

        if exif_data:
            for tag_id, value in exif_data.items():
                tag = ExifTags.TAGS.get(tag_id, tag_id)
                if tag == "GPSInfo":
                    for key in value:
                        gps_tag = ExifTags.GPSTAGS.get(key, key)
                        gps_data[gps_tag] = value[key]
                    extracted["GPSInfo"] = gps_data
                else:
                    extracted[tag] = value
        return extracted
    except Exception:
        return {}

def calculate_sharpness(image):
    try:
        img_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
        laplacian_var = cv2.Laplacian(img_cv, cv2.CV_64F).var()
        return laplacian_var
    except Exception:
        return 0

def calculate_compression_ratio(image, file_size):
    width, height = image.size
    resolution = width * height
    if resolution == 0:
        return 0
    ratio = file_size / resolution
    return ratio

def analyze_histogram(image):
    try:
        img = np.array(image)
        if len(img.shape) == 3:
            channels = img.shape[2]
        else:
            channels = 1

        histograms = []
        for i in range(channels):
            channel_data = img[:, :, i] if channels > 1 else img
            hist = np.histogram(channel_data, bins=256, range=(0, 256))[0]
            histograms.append(hist)

        variance = np.mean([np.var(h) for h in histograms])
        return variance
    except Exception:
        return 0

@app.route('/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    try:
        image = Image.open(file)
    except Exception as e:
        return jsonify({"error": f"Error opening image: {e}"}), 500

    meta = get_exif_data(image)
    score = 0
    reasons = []

    analysis = {
        "Format": image.format,
        "Size": image.size,
        "ColorMode": image.mode
    }

    # Check EXIF metadata
    if image.format == 'JPEG':
        if not meta:
            score += 30
            reasons.append("No EXIF metadata found (JPEG likely edited or old).")
    elif image.format == 'PNG':
        if not image.info:
            score += 30
            reasons.append("No metadata chunks found in PNG (possibly edited or old).")

    # Software info detection
    software_info = None
    if "Software" in meta:
        software_info = meta["Software"]
    elif "software" in image.info:
        software_info = image.info['software']

    if software_info:
        analysis["Software"] = software_info
        software_name = str(software_info).lower()
        if any(tool in software_name for tool in ["photoshop", "snapseed", "editor", "fireworks", "gimp"]):
            score += 40
            reasons.append(f"Edited using {software_info} (high chance of editing).")
        else:
            score += 10
            reasons.append(f"Software tag found: {software_info} (possible edit).")
    else:
        reasons.append("No editing software tag found.")

    # GPS Info Check
    if "GPSInfo" in meta:
        reasons.append("GPS data found — likely from original camera.")
    else:
        score += 10
        reasons.append("No GPS info — often stripped in edited images.")

    # Resolution Heuristic
    width, height = image.size
    if width < 600 or height < 600:
        score += 20
        reasons.append("Low resolution image — possible compression or editing.")
    else:
        reasons.append("Resolution seems good — likely original.")

    # Sharpness Check
    sharpness = calculate_sharpness(image)
    analysis["SharpnessScore"] = sharpness
    if sharpness < 50:
        score += 10
        reasons.append("Low image sharpness — could be blurred or tampered.")
    else:
        reasons.append("Image appears sharp — clarity is good.")

    # Compression Ratio Check
    file.seek(0, 0)
    file_bytes = file.read()
    file_size = len(file_bytes)
    compression_ratio = calculate_compression_ratio(image, file_size)
    analysis["CompressionRatio"] = round(compression_ratio, 4)
    if compression_ratio > 0.5:
        score += 5
        reasons.append("High compression ratio — may indicate compression artifacts.")
    else:
        reasons.append("Compression level looks reasonable.")

    # Histogram Analysis
    hist_variance = analyze_histogram(image)
    analysis["HistogramVariance"] = round(hist_variance, 2)
    if hist_variance < 5000:
        score += 5
        reasons.append("Low histogram variance — limited color diversity (possible edit).")
    else:
        reasons.append("Color diversity appears normal.")

    # Final scoring
    score = min(score, 100)
    analysis["Score"] = score
    analysis["Reasons"] = reasons

    if score >= 70:
        analysis["Verdict"] = "HIGH chance of being EDITED or altered"
    elif score >= 40:
        analysis["Verdict"] = "MODERATE chance of being edited or low quality"
    else:
        analysis["Verdict"] = "Likely ORIGINAL or not significantly modified"

    return jsonify(analysis)

if __name__ == '__main__':
    app.run(debug=True,port=5001)

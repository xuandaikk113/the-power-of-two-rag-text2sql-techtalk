"""
Script to fix slide numbering after adding a new slide marked with data-slide="x".

This script:
1. Finds the slide with data-slide="x"
2. Renumbers all slides after it
3. Updates total slide count throughout the presentation
"""

import re
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)


def find_slide_x_position(content):
    """Find the position of the slide marked with data-slide='x'."""
    pattern = r'data-slide="(\w+)"'
    matches = list(re.finditer(pattern, content))
    
    for idx, match in enumerate(matches):
        if match.group(1) == 'x':
            logger.info(f"Found slide 'x' at position {idx + 1}")
            return idx + 1, len(matches)
    
    logger.warning("No slide with data-slide='x' found")
    return None, len(matches)


def renumber_slides(content, x_position, total_slides):
    """Renumber slides after position x and update total count."""
    pattern = r'data-slide="(\w+)"'
    matches = list(re.finditer(pattern, content))
    
    # Build replacement map
    replacements = []
    new_total = total_slides
    
    for idx, match in enumerate(matches):
        old_value = match.group(1)
        position = idx + 1
        
        if old_value == 'x':
            # Replace 'x' with the actual position number
            replacements.append((match.span(1), str(position)))
        elif old_value.isdigit():
            old_num = int(old_value)
            if old_num >= x_position:
                # Increment slide numbers that come after x
                new_num = old_num + 1
                replacements.append((match.span(1), str(new_num)))
                new_total = max(new_total, new_num)
    
    # Apply replacements in reverse order to preserve positions
    result = content
    for span, new_value in reversed(replacements):
        result = result[:span[0]] + new_value + result[span[1]:]
    
    logger.info(f"Updated {len(replacements)} slide data-slide attributes")
    return result, new_total


def update_slide_numbers_display(content, x_position, new_total):
    """Update slide number displays like '5 / 23' or 'x'."""
    # Pattern for standard format: "5 / 23"
    pattern1 = r'<div class="slide-number">(\d+) / (\d+)</div>'
    # Pattern for 'x' placeholder
    pattern2 = r'<div class="slide-number">x</div>'
    
    matches1 = list(re.finditer(pattern1, content))
    matches2 = list(re.finditer(pattern2, content))
    
    replacements = []
    
    # Handle standard format
    for match in matches1:
        current_num = int(match.group(1))
        
        # Determine new current number
        if current_num >= x_position:
            new_current = current_num + 1
        else:
            new_current = current_num
        
        new_display = f'<div class="slide-number">{new_current} / {new_total}</div>'
        replacements.append((match.span(), new_display))
    
    # Handle 'x' placeholder - replace with correct position
    for match in matches2:
        new_display = f'<div class="slide-number">{x_position} / {new_total}</div>'
        replacements.append((match.span(), new_display))
    
    # Apply replacements in reverse order
    result = content
    for span, new_value in reversed(sorted(replacements, key=lambda x: x[0][0])):
        result = result[:span[0]] + new_value + result[span[1]:]
    
    logger.info(f"Updated {len(replacements)} slide number displays")
    return result


def update_total_slides_js(content, new_total):
    """Update the totalSlides constant in JavaScript."""
    pattern = r'const totalSlides = \d+;'
    replacement = f'const totalSlides = {new_total};'
    
    result = re.sub(pattern, replacement, content)
    logger.info(f"Updated JavaScript totalSlides to {new_total}")
    return result


def fix_slide_numbers(filepath):
    """Main function to fix all slide numbering."""
    filepath = Path(filepath)
    
    if not filepath.exists():
        logger.error(f"File not found: {filepath}")
        return False
    
    logger.info(f"Reading file: {filepath}")
    content = filepath.read_text(encoding='utf-8')
    
    # Find position of slide 'x'
    x_position, total_slides = find_slide_x_position(content)
    
    if x_position is None:
        logger.info("No slide 'x' found. Nothing to fix.")
        return False
    
    # Renumber data-slide attributes
    content, new_total = renumber_slides(content, x_position, total_slides)
    
    # Update slide number displays
    content = update_slide_numbers_display(content, x_position, new_total)
    
    # Update JavaScript totalSlides
    content = update_total_slides_js(content, new_total)
    
    # Write back to file
    logger.info(f"Writing updated content to: {filepath}")
    filepath.write_text(content, encoding='utf-8')
    
    logger.info(f"✅ Successfully fixed slide numbers. Total slides: {new_total}")
    return True


if __name__ == '__main__':
    presentation_file = Path(__file__).parent / 'rag-text2sql-presentation.html'
    fix_slide_numbers(presentation_file)

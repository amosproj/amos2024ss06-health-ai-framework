from nutritionfacts import scrape_blogs

# TODO: ADAPT THIS TO PREET'S NEW ORCHESTRATOR PIPELINE NEXT SPRINT

if __name__ == '__main__':
    base_url = 'https://nutritionfacts.org/blog/'
    scrape_blogs(base_url)

setup:
	conda create -n ci python=3.10
	conda activate ci
	pip install -r requirements.txt
	npm install

init:
	conda activate ci

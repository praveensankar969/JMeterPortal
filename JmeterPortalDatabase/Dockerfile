FROM mcr.microsoft.com/mssql/server:2019-latest
RUN bash
WORKDIR /app
COPY . /app
#RUN chmod +x setup_database.sh
ENV SA_PASSWORD IGVch123PX
ENV ACCEPT_EULA Y
EXPOSE 1433
CMD /bin/bash ./entrypoint.sh